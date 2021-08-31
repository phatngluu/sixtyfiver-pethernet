module.exports = { assertThrows, assertEvent };

async function assertThrows(pred, expectedMsg) {
    let e;
    try {
        await pred();
    } catch (ex) {
        e = ex;
    }
    assert.throws(() => {
        if (e) { throw e; }
    });

    if (e && expectedMsg) {
        assert.include(e.message, expectedMsg, `Expected ${expectedMsg}, but got ${e.message}`);
    }
}

function assertEvent(expected, response) {
    if (response === undefined || ( response?.logs === undefined || response.logs[0]?.event === undefined)) {
        assert.fail(`Expected ${expected}, but got ${undefined}`)
    } else if (expected !== response.logs[0].event){
        assert.fail(`Expected ${expected}, but got ${response.logs[0].event}`)
    }
}