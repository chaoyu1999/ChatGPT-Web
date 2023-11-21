"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
exports.useAppConfig = exports.ModalConfigValidator = exports.limitNumber = exports.DEFAULT_CONFIG = exports.Theme = exports.SubmitKey = void 0;
var client_1 = require("../config/client");
var constant_1 = require("../constant");
var store_1 = require("../utils/store");
var SubmitKey;
(function (SubmitKey) {
    SubmitKey["Enter"] = "Enter";
    SubmitKey["CtrlEnter"] = "Ctrl + Enter";
    SubmitKey["ShiftEnter"] = "Shift + Enter";
    SubmitKey["AltEnter"] = "Alt + Enter";
    SubmitKey["MetaEnter"] = "Meta + Enter";
})(SubmitKey = exports.SubmitKey || (exports.SubmitKey = {}));
var Theme;
(function (Theme) {
    Theme["Auto"] = "auto";
    Theme["Dark"] = "dark";
    Theme["Light"] = "light";
})(Theme = exports.Theme || (exports.Theme = {}));
exports.DEFAULT_CONFIG = {
    lastUpdate: Date.now(),
    submitKey: SubmitKey.CtrlEnter,
    avatar: "1f603",
    fontSize: 14,
    theme: Theme.Auto,
    tightBorder: !!((_a = client_1.getClientConfig()) === null || _a === void 0 ? void 0 : _a.isApp),
    sendPreviewBubble: true,
    enableAutoGenerateTitle: true,
    sidebarWidth: constant_1.DEFAULT_SIDEBAR_WIDTH,
    disablePromptHint: false,
    dontShowMaskSplashScreen: false,
    hideBuiltinMasks: false,
    customModels: "",
    models: constant_1.DEFAULT_MODELS,
    modelConfig: {
        model: "gpt-3.5-turbo-1106",
        temperature: 0.5,
        top_p: 0,
        max_tokens: 4096,
        presence_penalty: 0,
        frequency_penalty: 0,
        sendMemory: true,
        historyMessageCount: 8,
        compressMessageLengthThreshold: 25000,
        enableInjectSystemPrompts: false,
        template: constant_1.DEFAULT_INPUT_TEMPLATE
    }
};
function limitNumber(x, min, max, defaultValue) {
    if (typeof x !== "number" || isNaN(x)) {
        return defaultValue;
    }
    return Math.min(max, Math.max(min, x));
}
exports.limitNumber = limitNumber;
exports.ModalConfigValidator = {
    model: function (x) {
        return x;
    },
    max_tokens: function (x) {
        return limitNumber(x, 0, 100000, 2000);
    },
    presence_penalty: function (x) {
        return limitNumber(x, -2, 2, 0);
    },
    frequency_penalty: function (x) {
        return limitNumber(x, -2, 2, 0);
    },
    temperature: function (x) {
        return limitNumber(x, 0, 1, 1);
    },
    top_p: function (x) {
        return limitNumber(x, 0, 1, 1);
    }
};
exports.useAppConfig = store_1.createPersistStore(__assign({}, exports.DEFAULT_CONFIG), function (set, get) { return ({
    reset: function () {
        set(function () { return (__assign({}, exports.DEFAULT_CONFIG)); });
    },
    mergeModels: function (newModels) {
        if (!newModels || newModels.length === 0) {
            return;
        }
        var oldModels = get().models;
        var modelMap = {};
        for (var _i = 0, oldModels_1 = oldModels; _i < oldModels_1.length; _i++) {
            var model = oldModels_1[_i];
            model.available = false;
            modelMap[model.name] = model;
        }
        for (var _a = 0, newModels_1 = newModels; _a < newModels_1.length; _a++) {
            var model = newModels_1[_a];
            model.available = true;
            modelMap[model.name] = model;
        }
        set(function () { return ({
            models: Object.values(modelMap)
        }); });
    },
    allModels: function () {
        var customModels = get()
            .customModels.split(",")
            .filter(function (v) { return !!v && v.length > 0; })
            .map(function (m) { return ({ name: m, available: true }); });
        var models = get().models.concat(customModels);
        return models;
    }
}); }, {
    name: constant_1.StoreKey.Config,
    version: 3.8,
    migrate: function (persistedState, version) {
        var state = persistedState;
        if (version < 3.4) {
            state.modelConfig.sendMemory = true;
            state.modelConfig.historyMessageCount = 4;
            state.modelConfig.compressMessageLengthThreshold = 1000;
            state.modelConfig.frequency_penalty = 0;
            state.modelConfig.top_p = 1;
            state.modelConfig.template = constant_1.DEFAULT_INPUT_TEMPLATE;
            state.dontShowMaskSplashScreen = false;
            state.hideBuiltinMasks = false;
        }
        if (version < 3.5) {
            state.customModels = "claude,claude-100k";
        }
        if (version < 3.6) {
            state.modelConfig.enableInjectSystemPrompts = true;
        }
        if (version < 3.7) {
            state.enableAutoGenerateTitle = true;
        }
        if (version < 3.8) {
            state.lastUpdate = Date.now();
        }
        return state;
    }
});
