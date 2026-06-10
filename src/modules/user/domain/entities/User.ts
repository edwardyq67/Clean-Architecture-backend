import { AuditableEntity } from '@/shared/domain/AuditableEntity';
import { UserId } from '../value-objects/UserId';
import { UserName } from '../value-objects/UserName';
import { UserEmail } from '../value-objects/UserEmail';

export interface UserProps {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    roles: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
}

export class User extends AuditableEntity {
    private constructor(
        id: UserId,
        private _name: UserName,
        private _email: UserEmail,
        private _passwordHash: string,
        private _roles: string[],
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        private _lastLoginAt: Date | null
    ) {
        super(id, isActive, createdAt, updatedAt);
    }

    get name(): UserName { return this._name; }
    get email(): UserEmail { return this._email; }
    get passwordHash(): string { return this._passwordHash; }
    get roles(): string[] { return this._roles; }
    get lastLoginAt(): Date | null { return this._lastLoginAt; }

    changeName(newName: string): void {
        this._name = UserName.create(newName);
        this._updatedAt = new Date();
    }

    changeEmail(newEmail: string): void {
        this._email = UserEmail.create(newEmail);
        this._updatedAt = new Date();
    }

    changePassword(newPasswordHash: string): void {
        this._passwordHash = newPasswordHash;
        this._updatedAt = new Date();
    }

    recordLogin(): void {
        this._lastLoginAt = new Date();
        this._updatedAt = new Date();
    }

    changeRole(newRole: string): void {
        this._roles = [newRole];
        this._updatedAt = new Date();
    }

    changeRoles(newRoles: string[]): void {
        this._roles = newRoles;
        this._updatedAt = new Date();
    }

    static create(
        name: string,
        email: string,
        passwordHash: string,
        role: string
    ): User {
        const now = new Date();
        return new User(
            UserId.create(),
            UserName.create(name),
            UserEmail.create(email),
            passwordHash,
            [role],
            true,
            now,
            now,
            null
        );
    }

    static reconstitute(data: UserProps): User {
        return new User(
            new UserId(data.id),
            UserName.create(data.name),
            UserEmail.create(data.email),
            data.passwordHash,
            data.roles,
            data.isActive,
            data.createdAt,
            data.updatedAt,
            data.lastLoginAt
        );
    }

    toDatabase() {
        return {
            id: this.id.toString(),
            name: this._name.toString(),
            email: this._email.toString(),
            password_hash: this._passwordHash,
            is_active: this._isActive,
            created_at: this._createdAt,
            updated_at: this._updatedAt,
            last_login_at: this._lastLoginAt
        };
    }
}
