// Implemented
import LockScreen from "./LockScreen.svelte";
import CreateNewUser from "./CreateNewUser.svelte";
import SetupDevice from "./SetupDevice.svelte";
import CreateUserProgress from "./CreateUserProgress.svelte";
import LockerContents from "./LockerContents.svelte";

import CreateDatabaseEntry from "./CreateDatabaseEntry.svelte";
import CreateDataServiceEntry from "./CreateDataServiceEntry.svelte";
import CreateDNSLink from "./CreateDNSLink.svelte";
import CreateIdentity from "./CreateIdentity.svelte";

const lockerSections = {
  
  CreateNewUser: { component: CreateNewUser },
  LockScreen: { component: LockScreen },
  SetupDevice: { component: SetupDevice },
  CreateUserProgress: { component: CreateUserProgress },
  LockerContents: { component: LockerContents },

  CreateDatabaseEntry: { component: CreateDatabaseEntry },
  CreateDataServiceEntry: { component: CreateDataServiceEntry },
  CreateDNSLink: { component: CreateDNSLink },
  CreateIdentity: { component: CreateIdentity },

};

export { lockerSections };
