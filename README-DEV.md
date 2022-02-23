# Local development
## Prerequisites

* Docker
* Docker Compose
* Linux / macOS / Windows 10 Pro or Enterprise
* Visual Studio Code

## Running the project
1. Clone the project from [GitHub](https://github.com/Requarks/wiki).
2. Open the project folder in **Visual Studio Code**
3. From the **Extensions** tab, install the **Remote Development** extension by Microsoft (*ms-vscode-remote.vscode-remote-extensionpack*)
4. Click the **green button** located in the bottom-left corner of VS Code: *(or open the command palette)*
	![ui-dev-vscode-remotebtn.png](/assets/ui/ui-dev-vscode-remotebtn.png =350x){.radius-5 .decor-shadow .ml-5}
5. Select **Remote Containers - Reopen in Container**
6. VS Code will now reload and start initializing the containers. Wait for it to complete. This **may take a while the very first time** as npm dependencies must be installed.
	![ui-dev-vscode-init.png](/assets/ui/ui-dev-vscode-init.png =500x){.radius-5 .decor-shadow .ml-5}
7. Open the **Terminal** *(View > Terminal)* and select "**1: bash**" from the dropdown selector on the right:
	![ui-dev-vscode-bash.png](/assets/ui/ui-dev-vscode-bash.png =400x){.radius-5 .decor-shadow .ml-5}
8. From the command line, type the following command to start Wiki.js in development mode:
    ```bash
      yarn dev
    ```
9. Wait for the initialization to complete. You'll be prompted to load **http://localhost:3000/** when ready.
9. Browse to **http://localhost:3000/** _(replace localhost with the hostname of your machine if applicable)_.
10. Complete the setup wizard to finish the installation.

## Stopping the project

Click on **File > Close Remote Connection** to stop the containers and close the Visual Studio Code instance.

## Removing the containers

When you're done and no longer need the development environment, open the **Remote Explorer** tab and remove all containers starting with the name `wiki`.

# Updating Wiki.js on server
1. Push to GitHub repository (will automatically run GitHub action to build and push docker image)
2. Access server terminal on local device: ```ssh -i ~/.ssh/igreencampaignhandbook root@ip```
3. Pull new image from docker: ```docker pull joppehoekstra/greencampaignhandbook:latest```
4. List docker containers ```docker container ls -a```
5. List docker images ```docker images```
6. Stop wiki container: ```docker stop wiki```
7. Remove docker container ```docker container rm <ID>```
8. Remove wiki image ```docker rmi <ID>```
9. Build new container from latest image: ```docker create --name=wiki -e DB_TYPE=postgres -e DB_HOST=db -e DB_PORT=5432 -e DB_PASS_FILE=/etc/wiki/.db-secret -v /etc/wiki/.db-secret:/etc/wiki/.db-secret:ro -e DB_USER=wiki -e DB_NAME=wiki -e UPGRADE_COMPANION=0 --restart=unless-stopped -h wiki --network=wikinet -p 80:3000 -p 443:3443 joppehoekstra/greencampaignhandbook:latest```
10. Start wiki container ```docker start wiki```

# Updating server
```bash
sudo apt update        # Fetches the list of available updates
sudo apt upgrade       # Installs some updates; does not remove packages
sudo apt full-upgrade  # Installs updates; may also remove some packages, if needed
sudo apt autoremove    # Removes any old packages that are no longer needed
sudo reboot            # Reboot if nessesary
```

# Initial setup
## Update machine
```bash
# Fetch latest updates
sudo apt -qqy update

# Install all updates automatically
sudo DEBIAN_FRONTEND=noninteractive apt-get -qqy -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' dist-upgrade
```
## Install docker
```bash
# Install dependencies to install Docker
sudo apt -qqy -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' install apt-transport-https ca-certificates curl gnupg-agent software-properties-common openssl

# Register Docker package registry
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Refresh package udpates and install Docker
sudo apt -qqy update
sudo apt -qqy -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' install docker-ce docker-ce-cli containerd.io
```
## Setup Containers
```bash
# Create installation directory for Wiki.js
mkdir -p /etc/wiki

# Generate DB secret
openssl rand -base64 32 > /etc/wiki/.db-secret

# Create internal docker network
docker network create wikinet

# Create data volume for PostgreSQL
docker volume create pgdata

# Create the containers
docker create --name=db -e POSTGRES_DB=wiki -e POSTGRES_USER=wiki -e POSTGRES_PASSWORD_FILE=/etc/wiki/.db-secret -v /etc/wiki/.db-secret:/etc/wiki/.db-secret:ro -v pgdata:/var/lib/postgresql/data --restart=unless-stopped -h db --network=wikinet postgres:11
docker create --name=wiki -e DB_TYPE=postgres -e DB_HOST=db -e DB_PORT=5432 -e DB_PASS_FILE=/etc/wiki/.db-secret -v /etc/wiki/.db-secret:/etc/wiki/.db-secret:ro -e DB_USER=wiki -e DB_NAME=wiki -e UPGRADE_COMPANION=0 --restart=unless-stopped -h wiki --network=wikinet -p 80:3000 -p 443:3443 joppehoekstra/greencampaignhandbook:latest
```

## Setup Firewall

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

sudo ufw --force enable
```

## Start the containers

```bash
docker start db
docker start wiki
docker start wiki-update-companion
```

## Access the setup wizard

On your browser, navigate to your server IP / domain name (e.g. http://your-server-ip/ ).

> If you can't load the page, wait 5 minutes and try again. It may take a few minutes for the containers to initialize on some systems.
{.is-info}

Complete the on-screen setup to finish your installation.

## Automatic HTTPS with Let's Encrypt

> You must complete the setup wizard (see [Getting Started](#getting-started)) **BEFORE** enabling Let's Encrypt!
{.is-warning}

1. Create an **A record** on your domain registrar to point a domain / sub-domain (e.g. wiki.example.com) to your server **public IP**.
2. Make sure you're able to load your wiki using that domain / sub-domain on HTTP (e.g. http://wiki.example.com).
3. Connect to your server via **SSH**.
4. **Stop** and **remove** the existing wiki container *(no data will be lost)* by running the commands below:

```bash
docker stop wiki
docker rm wiki
```

5. Run the following command by replacing the `wiki.example.com` and `admin@example.com` values with **your own domain / sub-domain** and the **email address** of your wiki administrator:

```bash
docker create --name=wiki -e LETSENCRYPT_DOMAIN=campaigners.europeangreens.eu -e LETSENCRYPT_EMAIL=hey@joppehoekstra.nl -e SSL_ACTIVE=1 -e DB_TYPE=postgres -e DB_HOST=db -e DB_PORT=5432 -e DB_PASS_FILE=/etc/wiki/.db-secret -v /etc/wiki/.db-secret:/etc/wiki/.db-secret:ro -e DB_USER=wiki -e DB_NAME=wiki -e UPGRADE_COMPANION=0 --restart=unless-stopped -h wiki --network=wikinet -p 80:3000 -p 443:3443 joppehoekstra/greencampaignhandbook:latest
```

6. Start the container by running the command:
```bash
docker start wiki
```

7. **Wait** for the container to start and the Let's Encrypt provisioning process to complete. You can optionaly view the container logs by running the command:
```
docker logs wiki
```
> The process will be completed once you see the following lines in the logs:
>
> `(LETSENCRYPT) New certifiate received successfully: [ COMPLETED ]`
> `HTTPS Server on port: [ 3443 ]`
> `HTTPS Server: [ RUNNING ]`
{.is-success}

8. Load your wiki in your web browser using HTTPS (e.g. https://wiki.example.com). Your wiki is now accepting HTTPS requests using a free Let's Encrypt certificate!

## Automatic HTTP to HTTPS Redirect

By default, requests made to the HTTP port will not be redirect to HTTPS. You can enable this option using these instructions:

1. Navigate to the **Administration Area** by clicking on your avatar at the top-right corner of the page.
2. From the left navigation menu, click on **SSL**.
3. Next to the `Redirect HTTP requests to HTTPS` section, click on **TURN ON** to enable HTTP to HTTPS redirection.
4. Any requests made to the HTTP port will now automatically redirect to HTTPS!

## Renew the Certificate

You can renew the certificate at any time from the **Administration Area** > **SSL**.

If your certificate has expired and you cannot load the wiki UI to renew it, simply restart the container:

```bash
docker restart wiki
```

The renewal process will run automatically during initialization.


