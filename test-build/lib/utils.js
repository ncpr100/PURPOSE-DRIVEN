"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateRole = exports.roleTranslations = exports.validatePhone = exports.validateEmail = exports.truncateText = exports.formatDateTime = exports.formatDate = exports.cn = void 0;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
    }).format(new Date(date));
}
exports.formatDate = formatDate;
function formatDateTime(date) {
    return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}
exports.formatDateTime = formatDateTime;
function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
exports.truncateText = truncateText;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
exports.validateEmail = validateEmail;
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}
exports.validatePhone = validatePhone;
exports.roleTranslations = {
    SUPER_ADMIN: 'Super Administrador',
    ADMIN_IGLESIA: 'Administrador de Iglesia',
    PASTOR: 'Pastor',
    LIDER: 'Líder',
    MIEMBRO: 'Miembro'
};
function translateRole(role) {
    return exports.roleTranslations[role] || role;
}
exports.translateRole = translateRole;
//# sourceMappingURL=utils.js.map