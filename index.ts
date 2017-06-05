import { TestFrameworkFactory, TestFramework, TestFrameworkSettings } from "stryker-api/test_framework";

declare var QUnit;

export class QUnitTestFramework implements TestFramework {

    public beforeEach(codeFragment: string): string {
        return `
            QUnit.testStart(function() {
                ${codeFragment}
            });
        `;
    }

    public afterEach(codeFragment: string): string {
        return `
            QUnit.testDone(function() {
                ${codeFragment}
            });
        `;
    }

    public filter(ids: number[]): string {
        console.log("filter: " + ids);
        return `
            (function() {
                QUnit.config.reorder = false;

                var i = 0;
                QUnit.originalTest = QUnit.originalTest || QUnit.test;
                QUnit.test = function () {
                    if (${JSON.stringify(ids)}.indexOf(i++) >= 0) {
                        QUnit.originalText.apply(this, arguments);
                    }
                };
            })();
        `;
    }
}

TestFrameworkFactory.instance().register("qunit", QUnitTestFramework);
