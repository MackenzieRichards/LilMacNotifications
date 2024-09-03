# Introduction
This project is an SPFx application customizer built for Modern SharePoint sites / pages. It will place itself in the header placeholder of your site and show alerts from a list within your site. It was initially based on this project [blog](https://thomasdaly.net/2021/10/10/alerts-header-spfx-project/), but replaced alerts showing in the header with react-toastify style alerts. 

Rebuilt fresh on SPFx v1.19.0 so that it will support:

Environments
+ Office 365

Browers
+ Edge
+ Chrome
+ FireFox

## Why does this project exist? 
Show users important announcements when they visit the home page. It can be set to show / expire based on dates and times. 


# Prerequisites to Build
1. [SPFx Development Environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
2. [Tenant App Catalog](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant#create-app-catalog-site)
4. Node 18.x.x
5. SPFx v1.19.0

# Installation & Deployment
The following steps assume that you've cloned this repository or downloaded the files and successfully installed all the dependencies using 'npm install'. Make sure to use the same version of node to get a successfull build. 

## Overview
1. Build the SPFx Application Customizer
2. Deploy the SPFx Application Customizer
3. Add the App to your site

## Step 1 - Build the Solution
It is recommended to run the 'build.cmd' file from the projects root folder. This file does all the normal SPFx build commands such as build, bundle, package-solution. The 'build.cmd' also does a number of other things out of scope for guide. Please refer to the following blogs posts for more information on this file.

### Modern App Build
When the build script completes you will have the app package for modern sites located in './sharepoint/solution/alerts-header.sppkg'

![App Package](https://github.com/tom-daly/spfx-side-navigation/blob/master/images/package.png)

## Step 2 - Deploy the Application Customizer

#### Modern Deployment
Modern site deployment is straightforward. [For more information about this process see official MS Docs](https://docs.microsoft.com/en-us/sharepoint/use-app-catalog)

1. Navigate to your tenant App Catalog
2. Click Apps for SharePoint in the Quick Launch menu
3. Click and drag the .sppkg file into the tenant App Catalog

![deploy app customizer](https://i.imgur.com/il6utDR.gif)

## Step 3 - Activate the App
Activation on a Modern site deployment is straightforward. [For more information about this process see official MS Docs](https://docs.microsoft.com/en-us/sharepoint/use-app-catalog)

1. Navigate to your Modern site
2. From the gear icon, click 'Add an App'
3. In the left menu, click 'From your Organization'
4. Click 'alerts-header-client-side-solution'

***In a minute or two it will be activated on that modern site***

![adding to site](https://github.com/tom-daly/spfx-side-navigation/blob/master/images/add_app.gif)

# Modifications


# How To Use
It's super easy to use, once activated just add items to the list.

## Alerts List
In Site Contents you'll see a new list called "Alerts" list, just add new list items.

