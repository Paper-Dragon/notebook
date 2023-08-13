# Gitlab二开从而自定义权限系统

>  Gitlab所给的权限太少了，因为业务需要，二开gitlab，自定义权限系统。
>
> 下面给guest角色删除源码访问权限。并保留提出issue的权限。查看label的权限

## 前言

我们都知道gitlab社区版和商业版本的内核是相同的，所以说社区版本的功能是企业版本的全部。只是部分配置没有放到web界面，需要命令行去修改

## 修改

经过查询，gitlab的权限以文本文件的形式存储在目录中,下面是权限系统的配置文件。

```bash
root@83f572345d3c:/# cd  /opt/gitlab/embedded/service/gitlab-rails/app/policies/
root@83f572345d3c:/opt/gitlab/embedded/service/gitlab-rails/app/policies# ll
total 344
drwxr-xr-x 1 root root  4096 Jul 12 08:05 ./
drwxr-xr-x 1 root root  4096 Apr 27  2021 ../
drwxr-xr-x 2 root root  4096 Apr 27  2021 alert_management/
drwxr-xr-x 3 root root  4096 Apr 27  2021 analytics/
drwxr-xr-x 2 root root  4096 Apr 27  2021 application_setting/
-rw-r--r-- 1 root root   170 Apr 27  2021 application_setting_policy.rb
-rw-r--r-- 1 root root   307 Apr 27  2021 award_emoji_policy.rb
-rw-r--r-- 1 root root  2245 Apr 27  2021 base_policy.rb
-rw-r--r-- 1 root root   148 Apr 27  2021 blob_policy.rb
-rw-r--r-- 1 root root   905 Apr 27  2021 board_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 ci/
drwxr-xr-x 2 root root  4096 Apr 27  2021 clusters/
-rw-r--r-- 1 root root   204 Apr 27  2021 commit_policy.rb
-rw-r--r-- 1 root root   234 Apr 27  2021 commit_status_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 concerns/
-rw-r--r-- 1 root root   118 Apr 27  2021 container_expiration_policy_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 container_registry/
-rw-r--r-- 1 root root   112 Apr 27  2021 container_repository_policy.rb
-rw-r--r-- 1 root root   102 Apr 27  2021 custom_emoji_policy.rb
-rw-r--r-- 1 root root   416 Apr 27  2021 deploy_key_policy.rb
-rw-r--r-- 1 root root   304 Apr 27  2021 deploy_keys_project_policy.rb
-rw-r--r-- 1 root root   320 Apr 27  2021 deploy_token_policy.rb
-rw-r--r-- 1 root root   573 Apr 27  2021 deployment_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 design_management/
-rw-r--r-- 1 root root   279 Apr 27  2021 draft_note_policy.rb
-rw-r--r-- 1 root root   653 Apr 27  2021 environment_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 error_tracking/
-rw-r--r-- 1 root root   228 Apr 27  2021 event_policy.rb
-rw-r--r-- 1 root root   106 Apr 27  2021 external_issue_policy.rb
-rw-r--r-- 1 root root  2940 Apr 27  2021 global_policy.rb
-rw-r--r-- 1 root root   111 Apr 27  2021 grafana_integration_policy.rb
-rw-r--r-- 1 root root   261 Apr 27  2021 group_deploy_key_policy.rb
-rw-r--r-- 1 root root   297 Apr 27  2021 group_deploy_keys_group_policy.rb
-rw-r--r-- 1 root root   101 Apr 27  2021 group_label_policy.rb
-rw-r--r-- 1 root root   822 Apr 27  2021 group_member_policy.rb
-rw-r--r-- 1 root root  7217 Apr 27  2021 group_policy.rb
-rw-r--r-- 1 root root   435 Apr 27  2021 identity_provider_policy.rb
-rw-r--r-- 1 root root   100 Apr 27  2021 instance_metadata_policy.rb
-rw-r--r-- 1 root root   863 Apr 27  2021 issuable_policy.rb
-rw-r--r-- 1 root root  1199 Apr 27  2021 issue_policy.rb
-rw-r--r-- 1 root root   890 Apr 27  2021 merge_request_policy.rb
drwxr-xr-x 3 root root  4096 Apr 27  2021 metrics/
-rw-r--r-- 1 root root   110 Apr 27  2021 milestone_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 namespace/
-rw-r--r-- 1 root root   825 Apr 27  2021 namespace_policy.rb
-rw-r--r-- 1 root root    95 Apr 27  2021 nil_policy.rb
-rw-r--r-- 1 root root  2736 Apr 27  2021 note_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 operations/
drwxr-xr-x 3 root root  4096 Apr 27  2021 packages/
-rw-r--r-- 1 root root   248 Apr 27  2021 personal_access_token_policy.rb
-rw-r--r-- 1 root root   846 Apr 27  2021 personal_snippet_policy.rb
-rw-r--r-- 1 root root   111 Apr 27  2021 project_ci_cd_setting_policy.rb
-rw-r--r-- 1 root root   105 Apr 27  2021 project_label_policy.rb
-rw-r--r-- 1 root root   681 Apr 27  2021 project_member_policy.rb
-rw-r--r-- 1 root root 23137 Jul 12 08:05 project_policy.rb
-rw-r--r-- 1 root root 22271 Jan 20  2022 project_policy.rb.bak
-rw-r--r-- 1 root root  1868 Apr 27  2021 project_snippet_policy.rb
-rw-r--r-- 1 root root   110 Apr 27  2021 project_statistics_policy.rb
-rw-r--r-- 1 root root   110 Apr 27  2021 prometheus_alert_policy.rb
-rw-r--r-- 1 root root   332 Apr 27  2021 protected_branch_policy.rb
-rw-r--r-- 1 root root   100 Apr 27  2021 release_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 releases/
-rw-r--r-- 1 root root   103 Apr 27  2021 repository_policy.rb
-rw-r--r-- 1 root root   445 Apr 27  2021 resource_label_event_policy.rb
-rw-r--r-- 1 root root    89 Apr 27  2021 service_policy.rb
-rw-r--r-- 1 root root   302 Apr 27  2021 suggestion_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 terraform/
-rw-r--r-- 1 root root   240 Apr 27  2021 timebox_policy.rb
-rw-r--r-- 1 root root   256 Apr 27  2021 todo_policy.rb
-rw-r--r-- 1 root root  1294 Apr 27  2021 user_policy.rb
drwxr-xr-x 2 root root  4096 Apr 27  2021 wiki_page/
-rw-r--r-- 1 root root   160 Apr 27  2021 wiki_page_policy.rb
-rw-r--r-- 1 root root   178 Apr 27  2021 wiki_policy.rb


```

编辑 project_policy.rb

```ruby
204   rule { can?(:guest_access) }.policy do
205     enable :read_project
206     enable :create_merge_request_in
207     enable :read_issue_board
208     enable :read_issue_board_list
209     enable :read_wiki
210     enable :read_issue
211     enable :read_label
212     enable :read_milestone
213     enable :read_snippet
214     enable :read_project_member
215     enable :read_note
216     enable :create_project
217     enable :create_issue
218     enable :create_note
219     enable :upload_file
220     enable :read_cycle_analytics
221     enable :award_emoji
222     enable :read_pages_content
223     enable :read_release
224     enable :read_analytics
225     enable :read_insights
226     #  new add 2023/07/12: for guest users enable label_create
227     enable :admin_label
228     enable :admin_issue
229     enable :admin_issue_board
230   end

```

## 重启服务器

若为rpm安装包安装，运行以下命令

```bash

gitlab-ctl reconfigure
```

若为docker运行，运行以下命令

```bash
gitlab-ctl reconfigure
gitlab-ctl restart
```









## 权限例子

```ruby
enable :guest_access
enable :reporter_access
enable :developer_access
enable :maintainer_access
enable :change_namespace
enable :change_visibility_level
enable :rename_project
enable :remove_project
enable :archive_project
enable :remove_fork_project
enable :destroy_merge_request
enable :destroy_issue
enable :set_issue_iid
enable :set_issue_created_at
enable :set_issue_updated_at
enable :set_note_created_at
enable :set_emails_disabled
enable :set_show_default_award_emojis
enable :read_project
enable :create_merge_request_in
enable :read_issue_board
enable :read_issue_board_list
enable :read_wiki
enable :read_issue
enable :read_label
enable :read_milestone
enable :read_snippet
enable :read_project_member
enable :read_note
enable :create_project
enable :create_issue
enable :create_note
enable :upload_file
enable :read_cycle_analytics
enable :award_emoji
enable :read_pages_content
enable :read_release
enable :read_analytics
enable :read_insights
enable :read_board
enable :read_list
enable :read_pipeline
enable :admin_label
enable :admin_issue
enable :public_user_access
enable :read_project_for_iids
enable :public_access
enable :build_download_code
enable :build_read_container_image
enable :request_access
enable :fork_project
enable :read_prometheus
enable :read_deployment
enable :create_metrics_user_starred_dashboard
enable :read_metrics_user_starred_dashboard
enable :create_package
enable :admin_issue_board
enable :admin_merge_request
enable :admin_milestone
enable :update_merge_request
enable :reopen_merge_request
enable :create_commit_status
enable :update_commit_status
enable :create_build
enable :update_build
enable :create_merge_request_from
enable :create_wiki
enable :push_code
enable :resolve_note
enable :create_container_image
enable :update_container_image
enable :destroy_container_image
enable :create_environment
enable :update_environment
enable :destroy_environment
enable :create_deployment
enable :update_deployment
enable :create_release
enable :update_release
enable :daily_statistics
enable :create_metrics_dashboard_annotation
enable :delete_metrics_dashboard_annotation
enable :update_metrics_dashboard_annotation
enable :read_alert_management_alert
enable :update_alert_management_alert
enable :create_design
enable :move_design
enable :destroy_design
enable :read_terraform_state
enable :read_pod_logs
enable :read_feature_flag
enable :create_feature_flag
enable :update_feature_flag
enable :destroy_feature_flag
enable :admin_feature_flag
enable :admin_feature_flags_user_lists
enable :create_pipeline
enable :update_pipeline
enable :create_pipeline_schedule
enable :destroy_package
enable :push_to_delete_protected_branch
enable :update_snippet
enable :admin_snippet
enable :admin_project_member
enable :admin_note
enable :admin_wiki
enable :admin_project
enable :admin_commit_status
enable :admin_build
enable :admin_container_image
enable :admin_pipeline
enable :admin_environment
enable :admin_deployment
enable :admin_pages
enable :read_pages
enable :update_pages
enable :remove_pages
enable :read_cluster
enable :add_cluster
enable :create_cluster
enable :update_cluster
enable :admin_cluster
enable :create_environment_terminal
enable :destroy_release
enable :destroy_artifacts
enable :admin_operations
enable :read_deploy_token
enable :create_deploy_token
enable :destroy_deploy_token
enable :read_prometheus_alerts
enable :admin_terraform_state
enable :create_freeze_period
enable :read_freeze_period
enable :update_freeze_period
enable :destroy_freeze_period
enable :admin_feature_flags_client
enable :metrics_dashboard
enable :read_package
enable :read_merge_request
enable :read_pipeline_schedule
enable :read_environment
enable :read_commit_status
enable :read_container_image
enable :download_code
enable :download_wiki_code
enable :read_build
enable :read_design
enable :read_design_activity
enable :read_issue_link
enable :read_security_configuration
enable :read_repository_graphs
enable :read_build_report_results
enable :admin_resource_access_tokens
enable :set_pipeline_variables
enable :access_security_and_compliance
```

