# CRM Google Maps

CRM Google Maps solution allows you to easily insert Google Maps web resource on your entity forms and show some address field on the map.

## Installation

1. You need to go to the [releases page](https://github.com/DynamicsNinja/CRM-Google-Maps/releases) to download the  CRM solution.
2. After you downloaded your solution you need to install it on your CRM instance

## Get Google Maps API Key

This solution is not working without a valid Google Maps API key so the first thing you need to do is create yourself an API key.

### Steps:

1. Open [Google API page](https://developers.google.com/maps/documentation/javascript/get-api-key) in your browser.
2. Click on the Get Key button.
3. Select Create a new project in the dropdown menu and enter project name (eg. CRM Google Maps)
4. Click on Create and enable API.
5. After a short waiting, you will get your API key in the popup that you need to store for later use.

## Configuration

1. The first step after you install your solution is to set your Google Maps API key, because maps will not work if there is no valid API key set in CRM.

2. Updating API key is done via configuration page in the solution that is shown in the image below.

   ![solution_config](docs\solution_config.png)

3. Then you need to assign security roles to the users that will manage/use Google Maps in CRM by assigning them CRM Google Maps Admin or CRM Google Maps User role.

   ![roles](docs\roles.png)

4. Then you need to add Google Maps web resource to the CRM form where you want to show the address on the map. You need to set one parameter (address) on the web resource in the Custom parameters textbox (eg. `address=address1_line1` or `address=address1_composite`)

   ![webresource_config](docs\webresource_config.png)

5. Now your web resource is ready to use if you followed steps above. The final result is shown in the picture below.

   ![maps_example](docs\maps_example.png)