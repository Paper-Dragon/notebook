# OpenResty的所有模块

## OpenResty版本1.25

```bash
./configure \
--prefix=/usr/local/openresty/nginx \
--with-cc-opt='-O2 \
-DNGX_LUA_ABORT_AT_PANIC \
-I/usr/local/openresty/zlib/include \
-I/usr/local/openresty/pcre/include \
-I/usr/local/openresty/openssl111/include' \
--add-module=../ngx_devel_kit-0.3.3 \
--add-module=../echo-nginx-module-0.63 \
--add-module=../xss-nginx-module-0.06 \
--add-module=../ngx_coolkit-0.2 \
--add-module=../set-misc-nginx-module-0.33 \
--add-module=../form-input-nginx-module-0.12 \
--add-module=../encrypted-session-nginx-module-0.09 \
--add-module=../srcache-nginx-module-0.33 \
--add-module=../ngx_lua-0.10.26 \
--add-module=../ngx_lua_upstream-0.07 \
--add-module=../headers-more-nginx-module-0.37 \
--add-module=../array-var-nginx-module-0.06 \
--add-module=../memc-nginx-module-0.20 \
--add-module=../redis2-nginx-module-0.15 \
--add-module=../redis-nginx-module-0.3.9 \
--add-module=../ngx_stream_lua-0.0.14 \
--with-ld-opt='-Wl,-rpath,/usr/local/openresty/luajit/lib \
-L/usr/local/openresty/zlib/lib \
-L/usr/local/openresty/pcre/lib \
-L/usr/local/openresty/openssl111/lib \
-Wl,-rpath,/usr/local/openresty/zlib/lib:/usr/local/openresty/pcre/lib:/usr/local/openresty/openssl111/lib' \
--with-cc='ccache gcc -fdiagnostics-color=always' \
--with-pcre-jit \
--with-stream \
--with-stream_ssl_module \
--with-stream_ssl_preread_module \
--with-http_v2_module \
--without-mail_pop3_module \
--without-mail_imap_module \
--without-mail_smtp_module \
--with-http_stub_status_module \
--with-http_realip_module \
--with-http_addition_module \
--with-http_auth_request_module \
--with-http_secure_link_module \
--with-http_random_index_module \
--with-http_gzip_static_module \
--with-http_sub_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_mp4_module \
--with-http_gunzip_module \
--with-threads \
--with-compat \
--with-stream \
--without-pcre2 \
--with-http_ssl_module
```

