#include <iostream>
#include <chrono>
#include <thread>
#include <windows.h>
#include <psapi.h>
#include <tchar.h>
#include <rpc.h>
#include <sddl.h>
#include <direct.h>
#include <lm.h>
#include <string>
#include <map>
#include <ctime>
#include <cstdlib>

#pragma comment(lib, "Rpcrt4.lib")
#pragma comment(lib, "Advapi32.lib")

// Structure to hold CPU times
struct CPUData {
    ULONGLONG idleTime;
    ULONGLONG kernelTime;
    ULONGLONG userTime;
};

// Structure to hold per-process CPU times
struct ProcessCPUData {
    ULONGLONG kernelTime;
    ULONGLONG userTime;
};

// Function to get memory information
void getMemoryInfo(MEMORYSTATUSEX& memInfo) {
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);
}

// Function to get the username of a process
std::string getProcessUsername(HANDLE hProcess) {
    HANDLE hToken;
    if (!OpenProcessToken(hProcess, TOKEN_QUERY, &hToken)) {
        return "<unknown>";
    }

    DWORD tokenInfoLength = 0;
    GetTokenInformation(hToken, TokenUser, nullptr, 0, &tokenInfoLength);
    if (GetLastError() != ERROR_INSUFFICIENT_BUFFER) {
        CloseHandle(hToken);
        return "<unknown>";
    }

    TOKEN_USER* tokenUser = (TOKEN_USER*)malloc(tokenInfoLength);
    if (!GetTokenInformation(hToken, TokenUser, tokenUser, tokenInfoLength, &tokenInfoLength)) {
        CloseHandle(hToken);
        free(tokenUser);
        return "<unknown>";
    }

    SID_NAME_USE sidType;
    char username[256], domain[256];
    DWORD usernameLength = 256, domainLength = 256;
    if (!LookupAccountSidA(nullptr, tokenUser->User.Sid, username, &usernameLength, domain, &domainLength, &sidType)) {
        CloseHandle(hToken);
        free(tokenUser);
        return "<unknown>";
    }

    CloseHandle(hToken);
    free(tokenUser);

    std::string userStr = std::string(domain) + "\\" + std::string(username);
    return userStr;
}

// Function to convert TCHAR to std::string
std::string convertTCharToString(const TCHAR* tcharStr) {
#ifdef UNICODE
    size_t len = wcslen(tcharStr);
    char* cStr = new char[len * 2 + 1];
    wcstombs(cStr, tcharStr, len * 2 + 1);
    std::string str(cStr);
    delete[] cStr;
    return str;
#else
    return std::string(tcharStr);
#endif
}

// Function to get total system CPU times
bool getTotalCPUData(CPUData& cpuData) {
    FILETIME idleTime, kernelTime, userTime;
    if (!GetSystemTimes(&idleTime, &kernelTime, &userTime)) {
        return false;
    }

    cpuData.idleTime = ((ULONGLONG)idleTime.dwHighDateTime << 32) | idleTime.dwLowDateTime;
    cpuData.kernelTime = ((ULONGLONG)kernelTime.dwHighDateTime << 32) | kernelTime.dwLowDateTime;
    cpuData.userTime = ((ULONGLONG)userTime.dwHighDateTime << 32) | userTime.dwLowDateTime;

    return true;
}

// Function to get process CPU times
bool getProcessCPUData(HANDLE hProcess, ProcessCPUData& procCpuData) {
    FILETIME creationTime, exitTime, kernelTime, userTime;
    if (!GetProcessTimes(hProcess, &creationTime, &exitTime, &kernelTime, &userTime)) {
        return false;
    }

    procCpuData.kernelTime = ((ULONGLONG)kernelTime.dwHighDateTime << 32) | kernelTime.dwLowDateTime;
    procCpuData.userTime = ((ULONGLONG)userTime.dwHighDateTime << 32) | userTime.dwLowDateTime;

    return true;
}

// Modified function to get process information with CPU usage and print to console
void getProcessInfo(std::ostream& out,
    const std::map<DWORD, ProcessCPUData>& previousProcessData,
    std::map<DWORD, ProcessCPUData>& currentProcessData,
    ULONGLONG totalCpuDiff) {
    DWORD processes[1024], cbNeeded, cProcesses;
    if (!EnumProcesses(processes, sizeof(processes), &cbNeeded)) {
        return;
    }

    cProcesses = cbNeeded / sizeof(DWORD);

    for (unsigned int i = 0; i < cProcesses; i++) {
        if (processes[i] != 0) {
            DWORD processID = processes[i];
            HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processID);
            if (hProcess) {
                PROCESS_MEMORY_COUNTERS pmc;
                if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) {
                    // Get process CPU times
                    ProcessCPUData procCpuData;
                    if (getProcessCPUData(hProcess, procCpuData)) {
                        currentProcessData[processID] = procCpuData;

                        double cpuUsage = 0.0;
                        auto it = previousProcessData.find(processID);
                        if (it != previousProcessData.end()) {
                            ULONGLONG procPrev = it->second.kernelTime + it->second.userTime;
                            ULONGLONG procCurr = procCpuData.kernelTime + procCpuData.userTime;
                            ULONGLONG procDiff = procCurr - procPrev;

                            if (totalCpuDiff > 0) {
                                cpuUsage = ((double)procDiff / (double)totalCpuDiff) * 100.0;
                            }
                        }

                        // Get process name
                        TCHAR processName[MAX_PATH] = TEXT("<unknown>");
                        HMODULE hMod;
                        DWORD cbNeededMod;

                        if (EnumProcessModules(hProcess, &hMod, sizeof(hMod), &cbNeededMod)) {
                            GetModuleBaseName(hProcess, hMod, processName, sizeof(processName) / sizeof(TCHAR));
                        }

                        std::string processNameStr = convertTCharToString(processName);
                        std::string username = getProcessUsername(hProcess);

                        // Get memory usage in KB
                        SIZE_T memoryUsageKB = pmc.WorkingSetSize / 1024;

                        // Print process info to console
                        out << "PID: " << processID
                            << ", Process Name: " << processNameStr
                            << ", Username: " << username
                            << ", CPU: " << cpuUsage << "%"
                            << ", Memory: " << memoryUsageKB << " KB" << std::endl;
                    }
                }
                CloseHandle(hProcess);
            }
        }
    }
}

// Function to generate a UUID
std::string generateUUID() {
    UUID uuid;
    UuidCreate(&uuid);

    RPC_CSTR szUuid = NULL;
    UuidToStringA(&uuid, &szUuid);

    std::string uuidStr(reinterpret_cast<char*>(szUuid));
    RpcStringFreeA(&szUuid);

    return uuidStr;
}

// Function to get current timestamp as a string
std::string getCurrentTimestamp() {
    std::time_t now = std::time(nullptr);
    char buf[100];
    std::strftime(buf, sizeof(buf), "%Y%m%d_%H%M%S", std::localtime(&now));
    return std::string(buf);
}

int main() {
    // Get initial CPU data
    CPUData prevCpuData;
    if (!getTotalCPUData(prevCpuData)) {
        std::cerr << "Failed to get initial CPU data." << std::endl;
        return 1;
    }

    // Map to store previous process CPU data
    std::map<DWORD, ProcessCPUData> prevProcessData;

    // Wait for 1 second to measure CPU usage differences
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Get current CPU data
    CPUData currCpuData;
    if (!getTotalCPUData(currCpuData)) {
        std::cerr << "Failed to get current CPU data." << std::endl;
        return 1;
    }

    // Calculate total CPU usage differences
    ULONGLONG idleDiff = currCpuData.idleTime - prevCpuData.idleTime;
    ULONGLONG kernelDiff = currCpuData.kernelTime - prevCpuData.kernelTime;
    ULONGLONG userDiff = currCpuData.userTime - prevCpuData.userTime;
    ULONGLONG totalDiff = (kernelDiff + userDiff);
    ULONGLONG totalActive = totalDiff - idleDiff;

    double totalCpuUsage = 0.0;
    if (totalDiff != 0) {
        totalCpuUsage = ((double)totalActive / (double)totalDiff) * 100.0;
    }

    // Generate UUID and timestamp for this snapshot
    std::string uuid = generateUUID();
    std::string timestamp = getCurrentTimestamp();

    // Get memory info
    MEMORYSTATUSEX memInfo;
    getMemoryInfo(memInfo);

    // Print system summary information to the console
    std::cout << "OS Resource Tracker Started"<< std::endl;
    std::cout << "Snapshot taken at " << timestamp << " with UUID " << uuid << std::endl;
    std::cout << "Total RAM: " << memInfo.ullTotalPhys / 1024 << " KB" << std::endl;
    std::cout << "Free RAM: " << memInfo.ullAvailPhys / 1024 << " KB" << std::endl;
    std::cout << "Used RAM: " << (memInfo.ullTotalPhys - memInfo.ullAvailPhys) / 1024 << " KB" << std::endl;
    std::cout << "Total CPU Usage: " << totalCpuUsage << "%" << std::endl;
    std::cout << "Processes:" << std::endl;

    // Map to store current process CPU data
    std::map<DWORD, ProcessCPUData> currentProcessData;

    // Get and display process information
    getProcessInfo(std::cout, prevProcessData, currentProcessData, totalDiff);

    std::cout << "OS Resource Tracker Completed" << std::endl;
    return 0;
}
