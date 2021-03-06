Welcome! This is my code for a craft site I build for a client's podcast website.

The backend is a LAMP server running on a digital ocean droplet.

The frontend is just HTML/CSS/JS with modules from NPM. I use webpack to process files.

The current purpose of this README is to roughly document my build steps for this project. I intend to revisit this process and flesh out the README into
a full-blown tutorial on how to do this yourself. I will probably do a youtube video as well.


My installation steps:
Craft Droplet
IP: 137.184.19.218

Fresh Install of Ubuntu 20.04 LTS

`sudo apt update`

## install apache
`sudo apt install apache2`

## Adjust the firewall to allow web traffic:
`sudo ufw allow "Apache Full"`

## install mysql
`sudo apt install mysql-server`
`sudo mysql_secure_installation`

## download php, and the packages to integrate it with apache and mysql
`sudo apt install php libapache2-mod-php php-mysql`

## make apache look for index.php before index.html
`sudo nano /etc/apache2/mods-enabled/dir.conf`
## Here I moved ‘index.php’ to before ‘index.html’ in the priority list.

## Restart the apache web server to make this take effect: 
`sudo systemctl restart apache2`

## apache serves from the default directory /var/www/html

I’m choosing to not set up multiple domains on this droplet for now.

## Creating a blank php script for testing purposes
`sudo nano /var/www/html/info.php`
This file was successfully served publicly at http://137.184.19.218/info.php
I removed this file for security reasons.

Apache only serves files from /var/www/
I probably need to configure craft to output to /var/www/

## setting Apache2 to always turn on when the server boots:
`sudo systemctl stop apache2.service`
`sudo systemctl start apache2.service`
`sudo systemctl enable apache2.service`




## Edited php.ini at /etc/php/7.4/apache2/
## In php.ini:
`file_uploads = On

allow_url_fopen = On

memory_limit = 256M

upload_max_filesize = 100M

max_execution_time = 360

date.timezone = America/Chicago`

## restarted apache to enable changes:

## Create the empty database
`sudo mysql -u root -p`
`create database craftdb;`

## Create the user ethan in mysql
`CREATE USER 'ethan'@'localhost' IDENTIFIED BY 'Physics105';`

## Give the user ethan all privileges in mysql
`GRANT ALL PRIVILEGES ON * . * TO 'ethan'@'localhost';`

## Clear away loose privileges for security
`flush privileges;`

https://www.digitalocean.com/community/tutorials/how-to-install-composer-on-ubuntu-20-04-quickstart

## Dependencies for installing composer
`sudo apt update`
`sudo apt install php-cli unzip`

all work so far has been done by the root user

## Get the composer installer, we are in /root/
`cd ~`
`curl -sS https://getcomposer.org/installer -o composer-setup.php`

## Get the composer security hash
``` HASH=`curl -sS https://composer.github.io/installer.sig` ```

## Run a script to verify the composer file against its hash
`php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"`

## Install composer
`sudo php composer-setup.php --install-dir=/usr/local/bin –filename=composer`

## In the linux os, add the user ethan
`adduser ethan`

password: **********

## granting ethan sudo powers
`usermod -aG sudo sammy`

https://craftcms.com/docs/3.x/requirements.html#required-php-extensions


https://stackoverflow.com/questions/30266250/how-to-fix-error-mkdir-permission-denied-when-running-composer

## Go to the directory where craft will be operating
`cd /var/www`

## Make ethan partial owner of the directory
`sudo chown -Rv root:$USER .`

## Give ethan powers to manipulate the directory
`sudo chmod -Rv g+rw .`

## Try installing craft
`composer create-project craftcms/craft /var/www/html/craft`

## In /etc/php/7.4/cli/php.ini enable:
`extension=curl`
`extension=mbstring`

## I got errors from the previous step so I did this:
`sudo apt-get install php7.4-curl`
`sudo apt-get install php-mbstring`
`sudo apt install php-xml`
`sudo apt-get install php7.4-zip`

`composer create-project craftcms/craft /var/www/html/craft`

success

in /etc/apache2/apache2.conf
~/sites-available/000-default.conf
~/default-ssl.conf
~/sites-enabled/000-default.conf
Changed `/var/www` to `/var/www/craft/web`

## Go to the directory where craft will be operating
`cd /var/www`

## Make ethan partial owner of the directory
`sudo chown -Rv root:$USER .`

## Give ethan powers to manipulate the directory
`sudo chmod -Rv g+rw .`

## Getting error 403 from apache, no permission to access that dir
unedited apache2.conf
unedited all apache config files to date

created craft.conf in sites-available
## /etc/apache2/sites-available
with content:
`<VirtualHost *:80>
     ServerAdmin admin@example.com
     DocumentRoot /var/www/html/craft/web
     ServerName example.com
     ServerAlias www.example.com

     <Directory /var/www/html/craft/>
          Options FollowSymlinks
          AllowOverride All
          Require all granted
     </Directory>

     ErrorLog ${APACHE_LOG_DIR}/error.log
     CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>`

`sudo a2ensite craft.conf`
`sudo a2enmod rewrite`

## I think that fixing the permission bug is the last bug I’ve got.

## I navigated to /var/www/html and ran:
`sudo chmod -Rv 777 craft`

## That fixed the last bug I was running into, but I think it’s a security flaw:

## After going to http://staging.ethanzitting.com/index.php?p=admin/install, craft told me I need imagick
`Sudo apt-get install php-imagick`

I ran into a bug with my mysql
## Check if mysql is running:
`ps ax | grep mysql`

## Start Mysql
`sudo service mysql start`

## http://staging.ethanzitting.com now serves a craft site!

## Next up: Enable https, and lock down file permissions
## creating a user for apache to run in
`groupadd apache`
`useradd -d /usr/local/apache2/htdocs -g apache -s /bin/false apache`

## In /etc/apache2/envvars, change to the following:
`export APACHE_RUN_USER=apache`
`export APACHE_RUN_GROUP=apache`


## In /etc/apache2/apache2.conf, change to 
`<Directory />
    Options None
    Order deny,allow
    Deny from all
</Directory>`

## Braking from that issue, enable https for security
`sudo apt install certbot python3-certbot-apache`

## Renamed /etc/apache2/sites-available/craft.conf to staging.ethanzitting.com.conf
`sudo a2ensite staging.ethanzitting.com`
`sudo systemctl reload apache2`

## Ensured that my DNS records point to this server in Google Domains

## ufw was dissabled, fixing
`ufw allow ssh`
`ufw enable`

`sudo certbot –apache`
## Success

## navigated to /var/www/html
`sudo chmod -R 755 craft`

`sudo chown -R apache craft`
`sudo systemctl restart apache2`

# Big Success!!!! Great big success.

## Now I’ll sling together a base podcast sight and bounce it off of Christy and Mosey

## In: /var/www/html/craft:
`sudo chown apache:ethan *`
`sudo chmod 755 *`

## Here I was having trouble writing files down inside nested directories
`sudo chmod -R 775 .`

Installed the following items through composer:
"require": {
"craftcms/cms": "3.7.11",
"craftcms/redactor": "2.8.8",
"misterbk/mix": "1.5.2",
"nystudio107/craft-seomatic": "3.4.6",
"sebastianlenz/linkfield": "1.0.25",
"verbb/expanded-singles": "1.1.4",
"verbb/field-manager": "2.2.4",
"verbb/super-table": "2.6.8",
"vlucas/phpdotenv": "^3.4.0"
},
"require-dev": {
"yiisoft/yii2-shell": "^2.0.3"
}

installed the following items through npm:
"devDependencies": {
"browser-sync": "^2.27.5",
"browser-sync-webpack-plugin": "^2.3.0",
"laravel-mix": "^6.0.31",
"postcss": "^8.3.8",
"resolve-url-loader": "^4.0.0",
"sass": "^1.42.1",
"sass-loader": "^12.1.0"
},
"dependencies": {
"normalize": "^0.3.1"
}

I am working to rebuild the motherhood reclaimed tech stack.

I've got to remember that my macos environment has progressed further than my server environment.
I will push my changes to my server environment, so I need to keep track of my macos env changes.
I created a richer, modular scss structure.
I've been updating webpack.mix.js periodically to output to web in ways I prefer.
Hell, I probably won't track many changes in the actual .twig and .scss files as there will be too many little ones.
I'll just track backendy type stuff.

`sudo apt install npm`
`npm install`
`sudo apt upgrade`
`npm install -g npm`

I am creating twig modules and feeding them into craftCMS. This is all heavily craft related, and doesn't make much sense to track here.
Youtube videos to follow.

Everything is going smoothly with setting up the craft modules and pulling simple data from craft.

I am working with the first podcast audio file now. It is almost a gigabyte. I will need to find out how to both:
 - compress the file as much as possible without it being too noticable,
 - lazy-load the audio file with 'buffering' so that the user can listen immediately and easily.

I will be streaming the audio files rather than just serving them. I do not want to use a lot of bandwidth on customers
that are only stopping by.

MP3 256kb/s seems like a good starting point

Using the software Audacity, I converted and compressed the podcast audio file from 900MB to 30MB.

Now I am experimenting with setting up assets and serving an audio file from craft.

My craft is telling me that my file upload is too big. Looks like this problem stems from php's config settings.

I located the php.ini file in /usr/local/etc/php/8.0 (macos)
I'm editing the max_input_time and upload_max_filesize and post_max_filesize to accomodate large audio files. 100MB
should do.

That increased my max from 2M to 16M, but I still need more.

adding: 'maxUploadFileSize' => 100000000,
    to: /config/general.php
inside the return statement and restarting the server fixed this issue.

I've now uploaded a 30M .mp3 to craft.
