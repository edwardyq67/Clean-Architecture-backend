import { Entity } from '@/shared/domain/Entity';
import { UserId } from '../value-objects/UserId';
import { UserName } from '../value-objects/UserName';
import { UserEmail } from '../value-objects/UserEmail';

export type UserRole = 'admin' | 'user' | 'moderator';

export class User extends Entity<UserId> {
    private constructor(
        id: UserId,
        private _name: UserName,
        private _email: UserEmail,
        private _passwordHash: string,
        private _roles: UserRole[],
        private _isActive: boolean,
        private _createdAt: Date,
        private _updatedAt: Date,
        private _lastLoginAt: Date | null
    ) {
        super(id);
    }

    // Getters
    get name(): UserName { return this._name; }
    get email(): UserEmail { return this._email; }
    get passwordHash(): string { return this._passwordHash; }
    get roles(): UserRole[] { return this._roles; }
    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get lastLoginAt(): Date | null { return this._lastLoginAt; }

    // Métodos de negocio
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

    activate(): void {
        this._isActive = true;
        this._updatedAt = new Date();
    }

    deactivate(): void {
        this._isActive = false;
        this._updatedAt = new Date();
    }

    recordLogin(): void {
        this._lastLoginAt = new Date();
        this._updatedAt = new Date();
    }

    changeRole(newRole: UserRole): void {
        this._roles = [newRole];
        this._updatedAt = new Date();
    }

    changeRoles(newRoles: UserRole[]): void {
        this._roles = newRoles;
        this._updatedAt = new Date();
    }

    // Factory methods
    static create(
        name: string,
        email: string,
        passwordHash: string,
        role: UserRole = 'user'
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

    static reconstitute(data: {
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        roles: UserRole[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }): User {
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

    toJSON() {
        return {
            id: this.id.toString(),
            name: this._name.toString(),
            email: this._email.toString(),
            roles: this._roles,
            isActive: this._isActive,
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
            lastLoginAt: this._lastLoginAt?.toISOString() || null
        };
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