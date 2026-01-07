(function() {

    myApp.config(['$stateProvider', '$locationProvider', '$ocLazyLoadProvider', function($stateProvider, $locationProvider, $ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            events: true
        });


        $stateProvider

            .state('options', {
            url: '/options',
            views: {
                'parent_View': {
                    templateUrl: 'views/options.html',
                    controller: 'options_ctrl',
                },
            },
        })

        .state('recorder', {
            url: '/recorder',
            views: {
                'parent_View': {
                    templateUrl: 'views/recorder.html',
                    controller: 'recorder_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "/angular/controllers/recorder.js",
                                ]
                            });
                        }]
                    }
                },
            },
        })

        .state('multibrowser', {
            url: '/multibrowser',
            views: {
                'parent_View': {
                    templateUrl: 'views/multibrowser.html',
                    controller: 'multibrowser_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/multibrowser.js",
                                    "angular/controllers/_modal_advanced_settings.js",
                                ]
                            });
                        }]
                    }
                },
            },
        })

        //.state('options.login', {
        //    url: '/options/login',
        //    views: {
        //        'partial_view_sub': {
        //            templateUrl: 'views/views_options/login.html',
        //            controller: 'login_ctrl',
        //            resolve: {
        //                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
        //                    debugger
        //                    return $ocLazyLoad.load({
        //                        files: [
        //                            "/angular/controllers/project_selection.js",
        //                        ]
        //                    });
        //                }]
        //            }

        //        }
        //    }
        //})
        .state('options.login', {
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_options/login.html',
                        controller: 'login_ctrl',

                    }
                }
            })
            .state('options.project_selection', {
                url: '/options/project_selection',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_options/project_selection.html',
                        controller: 'project_selection_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/project_selection.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })
            .state('options.recording_selection', {
                url: '/options/recording_selection',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_options/RecordingSelectionPage.html',
                        controller: 'recording_selection_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/recording_selection.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })

        .state('options.create_followme', {
                url: '/options/create_followme',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_options/CreateFollowMe.html',
                        controller: 'createFollowMe_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "/js/jsgrid.js",
                                        "angular/controllers/create_follow_me.js",
                                        "angular/controllers/modal_create_followme.js",
                                        "angular/controllers/_modal_Operation_Followme.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })
            .state('options.create_followme_login', {
                url: '/options/create_followme_login',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_options/CreateFollowMe_Login.html',
                        controller: 'createFollowMeLogin_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/create_follow_me_login.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })


        .state('options.recording_normal', {
            url: '/options/recording_normal',
            views: {
                'partial_view_sub': {
                    templateUrl: 'views/views_options/recording_normal.html',
                    controller: 'normal_recording_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/recording_normal.js",
                                    "/js/SAASController/mainController.js",
                                    "/js/SAASController/recordOpKeyTestController.js",
                                    "/js/SAASController/runTestController.js",
                                    "/js/SAASController/recordResponsiveTestController.js",
                                ]
                            });
                        }]
                    }
                }
            }
        })

        .state('options.recording_responsive', {
            url: '/options/recording_responsive',
            views: {
                'partial_view_sub': {
                    templateUrl: 'views/views_options/recording_normal.html',
                    controller: 'normal_recording_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/recording_normal.js",
                                    "/js/SAASController/mainController.js",
                                    "/js/SAASController/recordOpKeyTestController.js",
                                    "/js/SAASController/runTestController.js",
                                    "/js/SAASController/recordResponsiveTestController.js",
                                ]
                            });
                        }]
                    }
                }
            }
        })

        .state('options.execution_selection', {
            url: '/options/execution_selection',
            views: {
                'partial_view_sub': {
                    templateUrl: 'views/views_options/execution_selection.html',
                    controller: 'option_execution_selection_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/option_execution_Selection.js",
                                ]
                            });
                        }]
                    }
                }
            }
        })

        .state('result', {
            url: '/result',
            views: {
                'parent_View': {
                    templateUrl: 'views/result.html',
                    controller: 'result_ctrl',
                }
            },
        })

        .state('result.sessions', {
            views: {
                'parent_View': {
                    templateUrl: 'views/result.html',
                    controller: 'result_ctrl',
                },
                'partial_view_sub': {
                    templateUrl: 'views/sessions.html',
                    controller: 'sessions_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/sessions.js",
                                ]
                            });
                        }]
                    }
                }
            },
        })


        .state('result.live_session', {
                url: '/result/live_session',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_result/live_session.html',
                        controller: 'result_live_session_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/live_session.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.multiple_live_session', {
                url: '/result/multiple_live_session',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/views_result/multiple_live_session.html',
                        controller: 'result_multiple_live_session_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/multiple_live_session.js",
                            ]
                        });
                    }]
                }
            })


        .state('result.closed_session', {
            url: '/result/closed_session',
            views: {
                'partial_view_sub': {
                    templateUrl: 'views/views_result/closed_session.html',
                    controller: 'result_closed_session_ctrl',
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    debugger
                    return $ocLazyLoad.load({
                        files: [
                            "angular/controllers/closed_session.js",
                        ]
                    });
                }]
            }
        })

        .state('queued_sessions', {
            url: '/queued_sessions',
            views: {
                'parent_View': {
                    templateUrl: 'views/views_result/queued_sessions.html',
                    controller: 'result_queued_sessions_ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                serie: true,
                                files: [
                                    "angular/controllers/result/queued_sessions.js",
                                ]
                            });
                        }]
                    }
                }
            }
        })

        .state('options2', {
            views: {
                'parent_View': {
                    templateUrl: '/views/options2.html',
                    controller: 'Options2Ctrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/options2.js",
                                ]
                            });
                        }]
                    }
                },
            },
        })

        .state('options2.execute_test_case', {
            url: '/options/execute_test_case',
            views: {
                'partial_view_sub': {
                    templateUrl: '/views/views_options/recording_normal.html',
                    controller: 'NormalRecordingCtrl',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            debugger
                            return $ocLazyLoad.load({
                                files: [
                                    "angular/controllers/recording_normal.js",
                                    "/js/SAASController/mainController.js",
                                    "/js/SAASController/recordOpKeyTestController.js",
                                    "/js/SAASController/runTestController.js",
                                    "/js/SAASController/recordResponsiveTestController.js",
                                ]
                            });
                        }]
                    }
                }
            }
        })

        .state('options2.result', {
                url: '/options/execute_test_case',
                views: {
                    'partial_view_sub': {
                        templateUrl: '/views/views_options/recording_normal.html',
                        controller: 'NormalRecordingCtrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/recording_normal.js",
                                        "/js/SAASController/mainController.js",
                                        "/js/SAASController/recordOpKeyTestController.js",
                                        "/js/SAASController/runTestController.js",
                                        "/js/SAASController/recordResponsiveTestController.js",
                                    ]
                                });
                            }]
                        }

                    }
                }
            })
            //-------------------------Region Closed session tab region----------------
            .state('result.closed_session.steplog', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_steplog.html',
                        controller: 'result_closed_tab_steplog_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_steplog.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.stepdetail', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_stepdetails.html',
                        controller: 'result_closed_tab_step_detail_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_stepdetails.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.remarks', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_remarks.html',
                        controller: 'result_closed_tab_remark_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_remarks.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.message', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_message.html',
                        controller: 'result_closed_tab_message_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_message.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.functionresult', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_functionresult.html',
                        controller: 'result_closed_tab_fun_result_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_functionresult.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.functioncall', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_functioncall.html',
                        controller: 'result_closed_tab_fun_call_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_functioncall.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.debuginfo', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_debuginfo.html',
                        controller: 'result_closed_tab_debuginfo_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_debuginfo.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.attachment', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_attachement.html',
                        controller: 'result_closed_tab_attachment_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_attachment.js",
                            ]
                        });
                    }]
                }
            })
            .state('result.closed_session.VisualValidation', {
                views: {
                    'tab_partial_View': {
                        templateUrl: '/views/views_result/closed_session_tabs/_tab_visual_validation.html',
                        controller: 'result_VisualValidation_ctrl',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        debugger
                        return $ocLazyLoad.load({
                            files: [
                                "angular/controllers/result/closed_session_tabs/tab_VisualValidation.js",
                            ]
                        });
                    }]
                }
            })

            .state('options.Manual_project_selection', {
                url: '/options/Manual/Manual_project_selection',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/Manual_view/Manual_project_selection.html',
                        controller: 'manual_project_selection_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/manual_project_selection.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })
            .state('options.Manual_create_view', {
                url: '/options/Manual/Manual_create_view',
                views: {
                    'partial_view_sub': {
                        templateUrl: 'views/Manual_view/Manual_create_view.html',
                        controller: 'Manual_create_view_ctrl',
                        resolve: {
                            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                                debugger
                                return $ocLazyLoad.load({
                                    files: [
                                        "angular/controllers/Manual_create_view.js",
                                        "angular/controllers/Preview_modal_ctrl.js",
                                    ]
                                });
                            }]
                        }

                    }

                }
            })

            .state('ManualRunnerView', {
                url: '/ManualRunner',
                views: {
                    'parent_View': {
                        templateUrl: 'views/Manual_view/ManualRunnerView.html',
                        controller: 'ManualRunnerView_ctrl',
                    },
                },
            })


    }]);

})();