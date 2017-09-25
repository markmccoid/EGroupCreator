# Analytix Installer Help
The Analytix installer will take you through either install a fresh copy of Analytix or Upgrading and existing version of Analytix.

For the installation, select the "Install" option on the first screen, choose a directory to install Analytix to (Usually "x:\Analytix") and press **Install**

If you are upgrading, please read through the following to make sure you understand what will be happening and what will be required of you after the application has finished the upgrade.

When choosing to upgrade, you will be asked to enter the location of your production Analytix.  This will be the directory that will be upgraded.  Based on your Analytix location, the application will choose a backup directory.  You may change this directory to a different location if you like.

The upgrade application will perform the following steps:

1. Backup your production Analytix to the backup directory chosen.
1. Copy the upgrade files to your Production Analytix directory.
1. Merge the Production qvVariables.json and qvGroups.json files with their Upgrade counterparts.
1. Application can be closed, however you will need to manually transfer custom tabs to the New QVWs

--------

### Backup of your Production Analytix
This is a straightforward copy of all the files in your production directory.  The only files not copied are the ***.qvd** files in the **\QVD** directory.

### Copy of Upgrade files
The following files will be copied to the Production directory:

- .\SOURCE -> *.QVW
- .\QVD -> *.QVW
- .\QVW -> copy the QVW over, but prefix them with UPG_
- .\Include\*.qvs
- .\Include\Image\*.*
- .\Include\SystemQVW\*.*
- .\Include\VariableEditor\
  - Before copying the new qvVariables.json file first rename the production copy to SITE_qvVariables.json.
- .\Include\GroupEditor\
  - Before copying the new qvGroups.json file first rename the production copy to SITE_qvGroups.json.

### Merge Files
The qvVariables.json and qvGroups.json files contain information used in your Analytix files.  These files can also be modified by the site administrator using the Variable Editor and/or Group Editor programs. 

If you edit these files, we do not want to overwrite anything you have changed with items from the upgrade files.

This step will compare each of these files with their counterpart in the upgrade and make sure to not overwrite anything that you have changed.

Once done, it will export the a new copy of the needed XML files to the ..\include\ directory.

### Manually Transfer Custom Tabs to New QVWs

Each site using Analytix has the ability to create custom report and chart objects in Analytix. Even though sites do this, there still must be a way to upgrade them to the latest version.  This is done by having the site keep all their custom reporting objects on separate tabs/sheets within the Analytix QVW files located in the QVW directory.

This makes it easy to merge their custom work with the new Analytix QVWs.

To perform this step, you will need to be on the Analytix server and using the Qlikview Developer software.

You will perform the following steps on each of the Analytix files in the Production QVW directory (probably Analytix\QVW).  Note, that some may not have any custom tabs.  If this is the case, then you do not need to do anything with that file and its associated UPG_ file.  

SalesFlash.qvw will be used in this example.

1. Open SalesFlash.qvw in Qlikview Developer (This is the sites QVW file)
1. Open a new instance of Qlikview Developer and open the UPG_SalesFlash.qvw
1. I like to put these two files side by side on a single screen.  You can use the WinKey + Left arrow for SalesFlash.qvw and then WinKey + Right arrow for the Qlikview Developer with the UPG_SalesFlash.qvw open.  It will look like this:

![](images/upgax_Step3-Merge1.png)

1. NOTE: You will be moving tabs FROM SalesFlash.qvw TO UPG_SalesFlash.qvw
2. For the actual moving of tabs, you will need to know which tabs are the site's custom tabs.  It is best to let the site tell you which tabs are theirs.  Also note that sites can choose to hide any of the default tabs that are in each Analytix application. 
   - NOTE: The "Budget" and "CRM" tabs are shown/hidden by setting a Varaible.  See main tab in SOURCE_SalesFlash.qvw.  The following variables can also be modified in the Variable Editor: -vLoadBudget, -vLoadCRM
3. Now the site's tabs will be copied from SalesFlash.qvw to UPG_SalesFlash.qvw.  To do this:
   - Make one of the site's tabs active.
   - Press Ctrl/Shift/S.  This will show all objects, even those that are hidden.
   - Press Ctrl/a.  This will select all of the objects.
   - Press Ctrl/c.  This will copy all of the objects to your clipboard.
   - Make the UPG_SalesFlash.qvw active.
   - From the Menu click "Layout/Add sheet...". This will add a new sheet to the UPG_SalesFlash.qvw file.
   - Press Ctrl/v. This will paste all of the previously selected objects.
   - From the Menu click "Settings/Sheet Properties...".  This will display the sheet properties dialog.  In this dialog rename the tab to match what is was in the old version and update any colors or other customization the site had done to the tab/sheet.
   - Move the tab to the proper position in the list of tabs.  This can be done by right clicking on the tab and choosing "Promote sheet" or "Demote Sheet".

Do this for the other QVW files that the site has made modifcations to.  More than likely it will just be the following:

- SalesFlash.qvw -> UPG_SalesFlash.qvw 
- AdvertisingAnalytix.qvw -> UPG_AdvertisingAnalytix.qvw
- Contracts.qvw -> UPG_Contracts.qvw
- ARAnaltyix.qvw -> UPG_ARAnaltyix.qvw




