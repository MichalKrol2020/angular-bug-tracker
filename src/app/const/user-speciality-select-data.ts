import {UserSpecialityEnum} from "../enum/user-speciality.enum";

const backend = "Backend";
const frontend = "Frontend";
const devops = "Devops";
const uiDesign = "UI Design";
const databaseDesign = "Database Design";

export const userSpecialitySelectData =
  [
    {
      option: backend
    },
    {
      option: frontend
    },
    {
      option: devops
    },
    {
      option: uiDesign
    },
    {
      option: databaseDesign
    }
  ]

export const userSpecialityMap =
  {
    [backend]: UserSpecialityEnum.BACKEND,
    [frontend]: UserSpecialityEnum.FRONT_END,
    [devops]: UserSpecialityEnum.DEVOPS,
    [uiDesign]: UserSpecialityEnum.UI_DESIGN,
    [databaseDesign]: UserSpecialityEnum.DATABASE_DESIGN
  }
