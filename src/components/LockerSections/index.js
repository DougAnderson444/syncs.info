// Implemented
import LockScreen from "./LockScreen.svelte";
import CreateNewUser from "./CreateNewUser.svelte";
import SetupDevice from "./SetupDevice.svelte";
import CreateUserProgress from "./CreateUserProgress.svelte";
import LockerContents from "./LockerContents.svelte";

const lockerSections = {
  CreateNewUser: { component: CreateNewUser },
  LockScreen: { component: LockScreen },
  SetupDevice: { component: SetupDevice },
  CreateUserProgress: { component: CreateUserProgress },
  LockerContents: { component: LockerContents },
};

export { lockerSections };
