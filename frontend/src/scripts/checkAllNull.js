export default function checkAllNull(obj) {
    return Object.values(obj).every(value => value === null);
}