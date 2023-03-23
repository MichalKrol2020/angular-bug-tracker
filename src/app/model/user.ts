
export class User
{
  id!: number;
  firstName: string;
  lastName: string;
  email: string;
  speciality: string;
  joinDate!: Date;
  profileImageUrl!: string;
  role!: string;


  constructor()
  {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.speciality = '';
  }
}
