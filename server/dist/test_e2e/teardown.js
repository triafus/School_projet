module.exports = async () => {
    if (global.testApp) {
        await global.testApp.close();
    }
};
//# sourceMappingURL=teardown.js.map