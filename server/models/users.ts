export interface UserAuth {
  email: string,
  password: string
};

export interface UserIn {
  name: string,
  email: string,
  password: string,
  accountType : string
}

export interface UserOut{
  name: string,
  email: string,
  accountType: string,
  id? : string
}