// UserModel.tsx
export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    level: number;
    points: number;
    carType: string;
    tokens: string[];
}

/**
 * Optional: You can also create a class to implement the interface which could include methods
 * for instance-specific logic, such as validations or formatted outputs.
 */
export class User implements IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    level: number;
    points: number;
    carType: string;
    tokens: string[];

    constructor({
        _id,
        firstName,
        lastName,
        email,
        profilePicture,
        level,
        points,
        carType,
        tokens,
    }: IUser) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.profilePicture = profilePicture;
        this.level = level;
        this.points = points;
        this.carType = carType;
        this.tokens = tokens;
    }

    /**
     * Example method: Get full name of the user.
     */
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Example method: Check if the user has access based on their level.
     */
    hasAccess(requiredLevel: number): boolean {
        return this.level >= requiredLevel;
    }
}
