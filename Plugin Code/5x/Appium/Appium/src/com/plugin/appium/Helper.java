package com.plugin.appium;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

public class Helper {

    static void WriteFile(String FilePath, String WhatToWrite) throws IOException {
        // Create file

        FileWriter fstream = new FileWriter(FilePath);
        BufferedWriter out = new BufferedWriter(fstream);
        out.write(WhatToWrite);

        // Close the output stream
        out.close();
        // System.out.println(WhatToWrite);
    }

    public static String RunCommand(String command, Boolean ShouldWait)

    throws IOException {
        command = command.replace("\\", "\\\\");
        String reply = "";

        String tempFileName = File.createTempFile("AppiumUtil", ".bat").getAbsolutePath();

        WriteFile(tempFileName, command);
        Process p = Runtime.getRuntime().exec(tempFileName);

        if (ShouldWait) {

            String line;
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while ((line = in.readLine()) != null) {
                reply += line;
            }

            in.close();
            p.destroy();
            (new File(tempFileName)).delete();

        }

        return reply;
    }

}
