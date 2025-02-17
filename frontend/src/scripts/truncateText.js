export default function truncateText(label, maxLength) {
    if (label.length > maxLength) {
        return label.substring(0, maxLength) + "...";
    }
    return label;
};