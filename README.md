Facebook Album Aggregator
========

A tiny jQuery plugin for fetching and displaying Facebook page albums and photos.

**Big note:** The way this is currently set up with the exposure of the app secret on the client side is not exactly secure. So use this at your own risk. I'm working on changing the code to be able to pull public photos without having to authenticate a user with a login some other way.

## Features

- List display of all albums a page owns (including thumbnail and title)
- Individual album "pages" (all JS based)
- Lightbox-like image enlargement with captions
- Barebones styling to make it super easy to insert into your own design


Usage
========

## 1. Reference jQuery & the Facebook Album Aggregator plugin

## 2. Initialize the plugin

The plugin needs to be initialized, either in ```<script>``` tags at the bottom of your HTML, or in a separate JavaScript file, like so:

        jQuery(document).ready(function ($) {
            $('#sample').FBAlbumAggregator({
                pageId: <page-id>, // FB page ID
                appId: <app-id>, // FB app ID
                appSecret: '<app-secret>' // FB app secret
            });
        });

The plugin should be called on an empty element (`#sample` above). Make sure that element is in your HTML!

### Parameters

#### Facebook Album Aggregator accepts five parameters. The first three are required to pull photos from the proper Facebook page.##

**pageId** *Required*

Can be found by clicking on the profile picture on your Facebook page and copying the third set of numbers delimited by periods. For example, if the URL is `https://www.facebook.com/glenwoodareachamber/photos/a.137248829677344.27949.137248356344058/462336567168567/?type=1&theater`, the page ID is `137248356344058`.

**appId** *Required*

A Facebook app must be created in order to grab public photos from a page, due to the Facebook API's authenticity requirements. A new website app can be created by going to https://developers.facebook.com/ and clicking "Add a New App" from the "My Apps" dropdown menu. Once the app is created, App ID is found on the app's page.

**appSecret** *Required*

Similar to the App ID, your App Secret is also found on the app's page.

**listClass**

The class name for the unordered list of albums. Do not include a dot in this string (i.e. use `classname` instead of `.classname`).

**albumClass**

The class name for the unordered list of photos on a single album. Do not include a dot in this string (i.e. use `classname` instead of `.classname`).

**albumLinkClass**

The class name for the anchor containing the thumbnail and title that links to a single album page. Do not include a dot in this string (i.e. use `classname` instead of `.classname`).

**singleLinkClass**

The class name for the anchor containing the thumbnail that links to an expanded photo on a single album page. Do not include a dot in this string (i.e. use `classname` instead of `.classname`).

## 4. Styling

The styles that are in ```/demo/style.css``` are needed for everything to work. You can tweak as desired. The CSS is barebones so it should fit seamlessly into any layouts, responsive or static, with a little of your own touch.