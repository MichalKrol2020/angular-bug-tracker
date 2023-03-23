import {userSpecialityMap} from "../../const/user-speciality-select-data";

export class UserEnumMapper
{
  public static mapSpecialityToEnumName(speciality: string)
  {
    return userSpecialityMap[speciality as keyof typeof userSpecialityMap];
  }
}
