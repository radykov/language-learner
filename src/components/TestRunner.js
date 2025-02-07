import React, { useState } from 'react';
import tests from '../api/__tests__/genaiapi-integration-tests';
import { Button, ApiKeyCheck, WarningMessage } from './CoreComponents';

const TestRunner = () => {
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [testData, setTestData] = useState(null);

    const runTest = async () => {
        setIsRunning(true);
        setResults([]);  // Clear previous results
        setTestData(null); // Clear previous test data
        try {
            setResults(prev => [...prev, "Starting test: testGetSentences"]);
            const testResult = await tests.testGetSentences("Mandarin");
            setTestData(testResult); // Store the returned test data
            setResults(prev => [...prev, "✅ Test completed"]);
        } catch (error) {
            setResults(prev => [...prev, `❌ Test failed: ${error.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div>
            <ApiKeyCheck />
            <div className="test-runner-container">
                <h1>Integration Test Runner</h1>
                <WarningMessage message="This is for debugging only. Modify TestRunner.js to select specific tests you want to run before clicking Run" />
                <Button
                    onClick={runTest}
                    disabled={isRunning}
                    variant="primary"
                >
                    {isRunning ? 'Running...' : 'Run Tests'}
                </Button>
                {isRunning && <div>Running tests...</div>}
                <pre className="test-results">
                    {results.map((result, index) => (
                        <div key={index}>{result}</div>
                    ))}
                    {testData && (
                        <div className="test-data">
                            <h3>Test Results:</h3>
                            {JSON.stringify(testData, null, 2)}
                        </div>
                    )}
                </pre>
            </div>
        </div>
    );
};

export default TestRunner;