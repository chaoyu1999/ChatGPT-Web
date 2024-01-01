"use strict";
exports.__esModule = true;
exports.EmojiAvatar = exports.Avatar = exports.AvatarPicker = exports.getEmojiUrl = void 0;
var emoji_picker_react_1 = require("emoji-picker-react");
var bot_svg_1 = require("../icons/bot.svg");
var black_bot_svg_1 = require("../icons/black-bot.svg");
function getEmojiUrl(unified, style) {
    return "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/" + style + "/64/" + unified + ".png";
}
exports.getEmojiUrl = getEmojiUrl;
function AvatarPicker(props) {
    return (React.createElement(emoji_picker_react_1["default"], { lazyLoadEmojis: true, theme: emoji_picker_react_1.Theme.AUTO, getEmojiUrl: getEmojiUrl, onEmojiClick: function (e) {
            props.onEmojiClick(e.unified);
        } }));
}
exports.AvatarPicker = AvatarPicker;
function Avatar(props) {
    var _a;
    if (props.model) {
        return (React.createElement("div", { className: "no-dark" }, ((_a = props.model) === null || _a === void 0 ? void 0 : _a.startsWith("gpt-4")) ? (React.createElement(black_bot_svg_1["default"], { className: "user-avatar" })) : (React.createElement(bot_svg_1["default"], { className: "user-avatar" }))));
    }
    return (React.createElement("div", { className: "user-avatar" }, props.avatar && React.createElement(EmojiAvatar, { avatar: props.avatar })));
}
exports.Avatar = Avatar;
function EmojiAvatar(props) {
    var _a;
    return (React.createElement(emoji_picker_react_1.Emoji, { unified: props.avatar, size: (_a = props.size) !== null && _a !== void 0 ? _a : 18, getEmojiUrl: getEmojiUrl }));
}
exports.EmojiAvatar = EmojiAvatar;
