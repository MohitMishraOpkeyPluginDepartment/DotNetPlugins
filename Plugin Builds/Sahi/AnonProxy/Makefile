


VER=0.104
NSIS=/c/Program Files/NSIS/makensis.exe

.PHONY: win32 pserver pserver.exe pserver.debug pserver.debug.exe pserver.uclibc

pserver:
	cd src; make ../$@

pserver.exe:
	cd src; make ../$@

pserver.debug.exe:
	cd src; make ../$@

pserver.debug:
	cd src; make ../$@

pserver.uclibc:
	cd src; make ../$@

clean:
	cd src; make $@

#PSERVER_UCLIBC=pserver.uclibc

# the dist source file should have enough to compile windows+linux
# and include binarys for easy installation for people without compilers.
dist: pserver.debug pserver
	rm -f anon_proxy_server_*.bz2
	mkdir anon_proxy_server_$(VER);
	mv -f cache/config.php cache/config.php.orig; cp -f cache/config_default.php cache/config.php
	mv -f homebase.lst homebase.lst.orig; cp -f homebase.lst.dist homebase.lst;
	tar -cf - pserver gnu_regex.lib gnu_regex.dll pserver_w32/pserver_w32.vcproj pserver_w32/pserver_w32.dsp LICENSE wpad.dat src/compile_uclibc Makefile .htaccess cache/.htaccess *.php *.js $(PSERVER_UCLIBC) pserver.debug src/*.h src/*.c src/pserver.dev src/Makefile src/.htaccess *.css *.lst img/.htaccess img/*.jpg img/*.gif cache/config.php >temp.tar
	cd anon_proxy_server_$(VER); tar -xf ../temp.tar;
	mv -f cache/config.php.orig cache/config.php
	mv -f homebase.lst.orig homebase.lst
	tar -cf - anon_proxy_server_$(VER) | bzip2 -c - >anon_proxy_server_$(VER).tar.bz2
	rm -rf anon_proxy_server_$(VER);



win32: pserver.exe pserver.debug.exe
	rm -f win32/anon_proxy_server_*.exe
	bzip2 -dc anon_proxy_server_$(VER).tar.bz2 | tar -xf -; 
	rm -rf win32/htdocs/anon_proxy_server; rmdir win32/htdocs/anon_proxy_server; mv anon_proxy_server_$(VER) win32/htdocs/anon_proxy_server
	rm -f win32/htdocs/anon_proxy_server/pserver.uclibc win32/htdocs/anon_proxy_server/pserver
	cp -f gnu_regex.dll libeay32.dll ssleay32.dll gnu_regex.lib LICENSE.win32 pserver.exe pserver.debug.exe win32/htdocs/anon_proxy_server/ 
	cd win32;  "$(NSIS)" ./anon_proxy_server.nsi; mv -f anon_proxy_server.exe anon_proxy_server_$(VER).exe

upload_sf:
	if test -e /usr/bin/cmd; then /usr/bin/cmd /c "ftp.exe -n <upload_sf.cmd"; else ftp -n <upload_sf.cmd; fi;



