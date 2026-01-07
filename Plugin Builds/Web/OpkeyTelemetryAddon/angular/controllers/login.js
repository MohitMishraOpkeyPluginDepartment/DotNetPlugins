
angular.module('myApp').controller("login_ctrl", ['$rootScope', '$scope', 'ServiceFactory', 'DataFactory',
    function ($rootScope, $scope, serviceFactory, dataFactory) {
        $rootScope.ScopeLogin = $scope;
        $scope.Load_Sub_View = function () {
            debugger
            serviceFactory.LoadDataWhenAngularViewLoaded("divElement_sub_View", Load_Sub_View);
        };


        function Load_Sub_View() {
            $(".record_selection_item").removeClass("active");
            $("#divPanel_Options").addClass("disabled");
            if (dataFactory.TimerOnlineUser) {
                clearInterval(dataFactory.TimerOnlineUser);
            }
            $(".navbar.navbar-default").hide();
            $("#Main_HomeBanner").hide();
            $("#div_footer_tutoriol").hide();
            $("#li_logout").hide();
            $("#li_user_info").hide();
            $("#li_project_info").hide();
            $("#div_panelOptions").hide();
            $("#divParent").addClass("UserLogin");
            //Opetions selection modifications
            $("#div_panelOptionsDetails").removeClass("col-sm-12");
            $("#div_panelOptionsDetails").addClass("col-sm-8");
            //$("#div_panelOptions").show();

            check_multiple_domain();

        }

        function check_multiple_domain() {
            chrome.runtime.sendMessage({ SetOpkeyOneVars: "SetOpkeyOneVars" }, function (response) { });
            loadingStart('body',"Please wait","");
            setTimeout(function(){
                let domain_array_key = localStorage.getItem('OPKEY_DOMAIN_NAMES_ARRAY');

                if(domain_array_key != null){
                    let domain_array = JSON.parse(domain_array_key);
                    
                    if(Array.isArray(domain_array)){

                        let active_domain = [];

                        for(let domain of domain_array) {
                            let isLogin = check_for_login(domain);
                            if(isLogin){
                                active_domain.push(domain);
                                break;
                            }                            
                        }

                        if(active_domain.length == 0){
                            check_login_cache();
                            loadingStop('body',"");
                            return false;
                        }
                        else if(active_domain.length == 1){
                            localStorage.setItem("OPKEY_DOMAIN_NAME",active_domain[0]);
                            localStorage.setItem("Domain",active_domain[0]);
                            $scope.Validate_opkey_Session();
                            loadingStop('body',"");
                            return false;
                        }
                        else if(active_domain.length > 1){
                            $("#multiple_domain").show();
                            $("#loginDiv").hide();
                            bind_multiple_domain_list(active_domain);
                            loadingStop('body',"");
                            return false;
                        }
                    }
                }
                else{
                    let domain_name = localStorage.getItem("OPKEY_DOMAIN_NAME");
                    if(domain_name != null){
                        $scope.Validate_opkey_Session();
                        loadingStop('body',"");
                        return;
                    }
                }
                loadingStop('body',"");
                check_login_cache();
            },500);
        }

        function check_for_login(domain){
            let isLogin = false;
            $.ajax({
                url: domain + "/OpkeyApi/GetSessionStatus",
                type: "Get",
                cache: false,
                async: false,
                timeout: 3000,
                success: function (result) {
                    if(result.User){
                        isLogin = true;
                    }
                    else {
                        isLogin = false;
                    }
                },
                error: function(){
                    isLogin = false;
                }
            });

            return isLogin;
        }

        function bind_multiple_domain_list(domain_array) {
            // $("#multiple_domain_list").kendoGrid({
            //     dataSource: domain_array,
            //     columns:[{field:"",title:"",width: 100, template: function(name){
            //         return `<span class="domain_row">
            //                     <img src="icons/logo-circle.png" class="" style="height:20px;width:20px;">${name}
            //                     <button class="btn open_domain_btn"><i class="oci oci-arrow-right"></i></button>
            //                 </sapn>`;
            //         }
            //     }],
            //     dataBound: function(e){
            //         $(".k-grid .k-grid-header").hide();

            //         $(".open_domain_btn").on('click',(ev) =>{
            //             debugger;
            //             let grid = $('#multiple_domain_list').data('kendoGrid');
            //             let Domain = grid.dataItem(ev.currentTarget.closest('tr'));
            //             localStorage.setItem("OPKEY_DOMAIN_NAME",Domain);
            //             localStorage.setItem("Domain",Domain);
            //             $scope.Validate_opkey_Session();
            //         })
            //     }
            // })
            let html = `<div class="tiles_wrapper mx-3">`;
            domain_array.forEach((domain, ind)=>{
                if(ind%2 == 0){
                    html = html + `<div class="panel_btn_create">`;
                }
                html = html + `<button type="button" class="domain_tile btn" title="${domain}" data-domain="${domain}" style="cursor: pointer;">
                                    <span><img src="icons/logo-circle.png" class="" style="height:20px;width:20px;"></span>   
                                    <span class="text-ellipsis d-block w-100">${domain}</span>
                                </button>`

                if(ind%2 != 0){
                    html = html + `</div>`;
                }
            });

            if(domain_array.length%2 != 0) {
                html = html + `</div>`;
            }

            html = html + `</div>`;

            $("#multiple_domain_list").html(html)

            $(".domain_tile").click(function(e){
                let Domain = $(e.currentTarget).attr('data-domain');
                localStorage.setItem("OPKEY_DOMAIN_NAME",Domain);
                localStorage.setItem("Domain",Domain);
                $scope.Validate_opkey_Session();
            })
        }

        $scope.open_login_view = function(){
            $("#multiple_domain").hide();
            $("#loginDiv").show();
        }


        function check_login_cache() {

            var domain_name = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            var user_name = serviceFactory.GetGlobalSetting("OPKEY_USER_NAME");

            if (domain_name != null) {
                $("#txtOpKeyEndPoint").val(domain_name);
            }

            if (user_name != null) {
                $("#txtUserName").val(user_name);
            }


            $("#txtUserName").keyup(function (e) {
                serviceFactory.SetGlobalSetting("OPKEY_USER_NAME", $(this).val());
            });

            /* [ Focus input ]*/
            $('.login_mid .form-control').each(function () {
                if ($(this).val() !== "") {
                    $(this).addClass('has-val');
                } else {
                    $(this).removeClass('has-val');
                    $(this).focus(function () {
                        $(this).addClass('has-val');
                    });
                    $(this).on('blur', function () {
                        if ($(this).val() !== "") {
                            $(this).addClass('has-val');
                        } else {
                            $(this).removeClass('has-val');
                        }
                    });
                }
            });

            $(".label-input").click(function(e){
                $(e.currentTarget.previousElementSibling).toggleClass('has-val');
                if($(e.currentTarget.previousElementSibling).hasClass('has-val')){
                    $(e.currentTarget.previousElementSibling).focus();
                }
            })

        }


        $("#txtOpKeyEndPoint").keyup(function (e) {

            return false;
            var url_domain = $(this).val();
            //url_domain = url_domain.replace("http://", "https://");
            //  serviceFactory.SetGlobalSetting("OPKEY_DOMAIN_NAME", url_domain);
            serviceFactory.CheckIsDomainHasHTTPS(url_domain);
        });

        function form_validator_login() {
            debugger;
            var txtOpKeyEndPoint = $("#txtOpKeyEndPoint").val().trim();
            var txtUserName = $("#txtUserName").val().trim();
            var txtPassword = $("#txtPassword").val().trim();

            $(".form_error").text('');

            if (txtOpKeyEndPoint === dataFactory.Empty) {
                $("#spErrorMessage").text('OpKey domain is required');
                return false;
            }
            if (txtUserName === dataFactory.Empty) {
                $("#spErrorMessage").text('Email is required');
                return false;
            }
            if (txtPassword === dataFactory.Empty) {
                $("#spErrorMessage").text('Password is required');
                return false;
            }

            return true;
        }

        $("#txtOpKeyEndPoint, #txtUserName, #txtPassword").keyup(function (event) {
            //debugger;
            if (event.keyCode === 13) {
                $scope.SignIn();
            }
        });

        $scope.SignIn = function () {

         

            var txtOpKeyEndPoint = $("#txtOpKeyEndPoint").val().trim();
            var txtUserName = $("#txtUserName").val().trim();
            var txtPassword = $("#txtPassword").val().trim();


            serviceFactory.SetGlobalSetting("OPKEY_DOMAIN_NAME", txtOpKeyEndPoint);
            serviceFactory.SetGlobalSetting("Domain", txtOpKeyEndPoint);
            serviceFactory.SetGlobalSetting("OPKEY_USER_NAME", txtUserName);
            serviceFactory.SetGlobalSetting("SELECTED_PROJECT_PID", dataFactory.EmptyGuid);



            var form_validator = form_validator_login();
            if (!form_validator) {
                return false;
            }
            dataFactory.OPKEY_URL = txtOpKeyEndPoint;

            $("#spErrorMessage").text('');

            loadingStart("#loginDiv", "Please Wait ...", ".btnTestLoader");

            $.ajax({
                url: txtOpKeyEndPoint + "/OpkeyApi/LoginToOpkey",
                type: "GET",
                data: {
                    username: txtUserName,
                    password: txtPassword,
                    forceLogin: true
                },
                success: function (result) {
                  
                    loadingStop("#loginDiv", ".btnTestLoader");

                    if (result.Success) {
                        $scope.Validate_opkey_Session();

                    }
                    else {


                        if (result.Message.indexOf("AlreadyLoggedInSameBrowser") > -1) {
                                                       window.location.reload();
                        }
                        else {
                            $("#spErrorMessage").text(result.Message);
                        }


                    }
                },
                error: function (error) {
                    loadingStop("#loginDiv", ".btnTestLoader");
                    // $("#spErrorMessage").text("Unable to Connect to Given Domain");
                    // $("#divPanelErrorMessage").show();
                    

                    
                }
            });

        }

        $scope.Forget_password = function () {
            debugger;

            var domain_url = $rootScope.Scope_Main.Get_Opkey_URL("OPKEY_DOMAIN_NAME");
            if (domain_url == null) {
                $("#spErrorMessage").text(
                    "Please provide domain name for Forgot Password");
                $("#divPanelErrorMessage").show();
                return;
            }
            if (domain_url != null) {
                if (domain_url == "") {
                    $("#spErrorMessage").text(
                        "Please provide domain name for Forgot Password");
                    $("#divPanelErrorMessage").show();
                    return;
                }
            }
            $("#divPanelErrorMessage").hide();
            chrome.windows.create({
                url: domain_url + "/Login/ForgotPassword",
                height: 600,
                width: 800
            });

        }


        $scope.SignUp = function () {
            debugger;
            chrome.windows.create({
                url: "https://www.opkey.com/Signup",
                state: "maximized"
            });
        }

        $scope.loadJsScript = function (src, defer, id) {
            const node = document.createElement('script');
            node.src = src;
            node.type = 'text/javascript';
            node.async = true;
            if (id != null) {
              node.id = id;
            }
            if (defer != null) {
              node.defer = defer;
            }
            document.getElementsByTagName('head')[0].appendChild(node);
            return node;
          }

          function initilizeKeycloak() {
            get_keycloak_attribute("Default")
 let interval = setInterval(() => {
  if(window && window['keycloak'] ){

    if(getKeycloakToken()){
        clearInterval(interval)
        loadingStop("#loginDiv", ".btnTestLoader");

        $scope.Validate_opkey_Session();
    }
  }else{
    loadingStop("#loginDiv", ".btnTestLoader");

    clearInterval(interval)
  }
 }, 2000);
        }

        function getKeycloakToken() {
            if(window && window['keycloak'] && window['keycloak']['token']){
                return window['keycloak']['token']
              }
              else{
                return null
              }
        }

        $scope.showInputCreds = false
        $scope.domainSet = function() {
            debugger
            var txtOpKeyEndPoint = $("#txtOpKeyEndPoint").val().trim();
            let urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/)?$/

            if(txtOpKeyEndPoint.length == 0){
                if($scope.showInputCreds){
                    $scope.showInputCreds = false
                  
                }
                $("#urlError").text("Please Enter url.");
                return
            }
            if(txtOpKeyEndPoint.length>0 && !urlPattern.test(txtOpKeyEndPoint)){
                $("#urlError").text("Url is not correct.");
                if($scope.showInputCreds){
                    $scope.showInputCreds = false
                
                }
                return
            }
            else{
                $("#urlError").text("");
            }
          

            serviceFactory.SetGlobalSetting("OPKEY_DOMAIN_NAME", txtOpKeyEndPoint);
            serviceFactory.SetGlobalSetting("Domain", txtOpKeyEndPoint);

            $.ajax({
                url: txtOpKeyEndPoint + "/login/get_data",
                type: "GET",
                success: function (result) {
                    // loadingStop("#loginDiv", ".btnTestLoader");
                    debugger
                    $("#urlError").text("");
                    if($scope.showInputCreds){
                        $scope.showInputCreds = false
                     
                    }
                    loadingStart("#loginDiv", "Please Wait ...", ".btnTestLoader");

                    $scope.loadJsScript("js/keycloak/keycloak.min.js", "defer", null).onload = () => {


                        $scope.loadJsScript("js/keycloak/opkey_keycloak_functions.js", null, null).onload = () => {
                            

                     
                        initilizeKeycloak()
                          
                    
                        }
                  
                      }
                },
                error: function (error) {
                    debugger
                    $scope.showInputCreds = true
                    $scope.$apply();
                    $("#urlError").text("");
                    $('#txtOpKeyEndPoint').val(txtOpKeyEndPoint)

                    
                }
            });
        };
        $scope.keyPressed = function(keyEvent) {
            if (keyEvent.which === 13){
                var txtOpKeyEndPoint = $("#txtOpKeyEndPoint").val().trim();
                let urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
                if(txtOpKeyEndPoint.length>0 && !urlPattern.test(txtOpKeyEndPoint)){
                    $("#urlError").text("Url is not correct.");
                    if($scope.showInputCreds){
                        $scope.showInputCreds = false
                       
                    }
                    return
                }

                if(txtOpKeyEndPoint.length == 0){
                    $scope.showInputCreds = false
           
                    $("#urlError").text("Please Enter url.");
                }
                $scope.domainSet()
                $("#urlError").text("");
            }
             
          }

    }]);




