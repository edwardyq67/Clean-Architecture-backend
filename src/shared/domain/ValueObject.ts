export abstract class ValueObject {
    protected abstract getEqualityComponents(): any[];

    equals(other: ValueObject): boolean {
        if (other === null || other === undefined) return false;
        if (!(other instanceof ValueObject)) return false;

        const thisComponents = this.getEqualityComponents();
        const otherComponents = other.getEqualityComponents();

        if (thisComponents.length !== otherComponents.length) return false;

        for (let i = 0; i < thisComponents.length; i++) {
            if (thisComponents[i] !== otherComponents[i]) return false;
        }

        return true;
    }
}