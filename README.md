# AthaJS
AthaJS is a cloud-based framework for complete home automation built using [FeathersJS].

Atha allows "Home Owners" to define houses with zones (e.g. "Living Room", "Upstairs", "Back Yard") and add controlled devices to each zone.  Home owners can create users and groups, setting permissions for which user/group can view and control the various devices.

AthaJS provides the primary server as well as the web client for managing the homes.  [AthaMobile](https://github.com/AlanDThiessen/AthaMobile) is the mobile application for controlling the various devices.  Other FeathersJS-based clients can be easily added.

## Usage

- User Authentication: Currently, only local (email/password) authentication is supported.  OAuth will be supported in the future.
- Home owners start by defining houses, zones, and devices.
- Home Owners define users, and groups to which they belong.
- Home Onwers define whether members of a group can view and/or change individual devices in the house.
- Users automatically see only the houses, zones, devices, etc. to which they have access.

## File Structure

- src/ - The main server code resides in the source directory.  This is structured based on FeathersJS.
- config/ - Application configuration settings for the FeathersJS app.
- public/ - The Web-based application served by the application when a browser connects.  This is an AngularJS and Feathers Client application.
- test/ - Unit tests should reside here...maybe eventually?


## Data Structure (aka Feathers Services)

### Authentication
This is the authentication service provided by FeathersJS.

### User
This is the user service extended from the FeathersJS service.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this User |
| email | The email address (login) for this User |
| password | The password Hash for the user |
| name | The name of the user |
| userId | The user id corresponding to the user who created this user |
| houseId | \[deprecated\] The house id to which this user corresponds |


### Houses
Houses provide the primary, top-level containment of groups, zones, and devices.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this House |
| userId | The user id corresponding to the creator/owner of this House |
| name | The name of the House |


### Roles
Roles is a service for giving users various types of roles (currently "Admin" and "House Admin" roles are supported).

| Field |Description |
|-------|:-------------|
| _id | The unique identifier for of the Role |
| userId | The id of the user with which to associate this role |
| role | A string representing the role (used in hooks) |


### Groups
Groups define the various groups, tagged with the creating user and associated house.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this Group |
| name | The name of this Group |
| userId | The user id corresponding to the user who created this Group |
| houseId | The id of the house to which this Group belongs |


### GroupUsers
GroupUsers proviedes the mechanism for connecting users to various groups.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this Group/User relationship |
| userId | The user id to associate with the group |
| groupId | The group id to associate with the user |

### Permissions
Permissions control whether a group can view and/or edit a particular device.  It is actually a fairly generic way to give users or groups access to another entity.
By default no permissions are granted.  They must be explicitly granted.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this permission |
| ownerId | The id of the owner of this permission (user or group) |
| itemId | The id of the item to which access should be controlled (house, zone, device) |
| function | A string representing the permission to grant ("read", or "update") |


### Zones
A zone is primarily an informational way to group devices.

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this Zone |
| name | The name of this Zone |
| userId | The id of the user which created the Zone |
| houseId | The id of the house to which this Zone belongs |


### Devices
A device represents a real device in a house which can be controlled or sensed (light, TV, motion sensor, etc.).

| Field | Description |
|-------|:-------------|
| _id | The unique identifier for this Device |
| name | The name of this Device |
| userId | The id of the user which created the Device |
| houseId | The id of the house to which this Device belongs |
| zoneId | The id of the zone to which this Device belongs |


### Device Status (*need a better name here?*)
A Devices status defines a type of status information which a device can have.  Examples include:

 - Status: (boolean) on/off (all kinds of devices can have on/off)
 - Level: (percentage) 0-100% (e.g. dimmable lights)
 - Channel: (number) A TV could have a channel
 - Volume: (percentage) 0-100% 
 - Temperature: (number) the degrees of temperature sensor

| Field | Description |
|-------|:-------------|

## Future Services

### Device Templates
Device Templates provide a mechanism for defining a Device with various Device Statuses.  For example:

- Light: Only has the on/off status.
- Dimmable Light: Has the on/off status plus the Level status.
- TV: Contains on/off status, channel, volume, (and other) statuses.

### Scenes
A Scene defines a pre-configured set of devices and status which can be enabled/disabled.  For example a "Date Mode" scene could dim the lights, turn on the stereo, and turn it to the jazz channel.  :-)

### Triggers
Triggers could be used to configure automation.  Perhaps they could be tied into the [IFTTT] service.

### Scripts
For more complex automated control, perhaps some script mechanism could be created.


[FeathersJS]: https://feathersjs.com/
[IFTTT]: https://ifttt.com/

