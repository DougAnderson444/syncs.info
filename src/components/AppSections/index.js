// Implemented
import Landing from "./Landing.svelte";
import CreateNewUser from "./CreateNewUser.svelte";
import SetupDevice from "./SetupDevice.svelte";
import CreateUserProgress from "./CreateUserProgress.svelte";
import DataTest from "./DataTest.svelte";


//Not yet  Implemented 
/**
import LogInOrCreateChoice from "./LogInOrCreateChoice.svelte";
import LogIn from "./LogIn.svelte";
import ProcessLogin from "./ProcessLogin.svelte";

import SetupIdleTimer from "../../setup-locker/steps/SetupIdleTimer.svelte";
import WalletContent from "../../wallet/wallet-content/WalletContent.svelte";
 */
const appSections = {
  Landing: { component: Landing },
  CreateNewUser: { component: CreateNewUser },
  SetupDevice: { component: SetupDevice },
  CreateUserProgress: { component: CreateUserProgress },
  DataTest: { component: DataTest }
  /*
  LogInOrCreateChoice: { component: LogInOrCreateChoice },
  LogIn: { component: LogIn },
  ProcessLogin: { component: ProcessLogin },

  SetupIdleTimer: { component: SetupIdleTimer },
  WalletContent: { component: WalletContent },
  */
};

export { appSections };
