import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  MiniMap,
} from 'react-flow-renderer';
import axios from 'axios';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 0 },
  },
];

function WorkflowBuilder() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Add a new generic node
  const addNode = (type) => {
    const id = (nodes.length + 1).toString();
    setNodes((nds) => nds.concat({
      id,
      data: { label: `${type} step` },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    }));
  };

  // Convert current flow to workflow definition
  const buildDefinition = () => {
    const steps = nodes
      .filter((n) => n.id !== '1')
      .map((node) => ({
        name: node.data.label,
        type: node.data.label.split(' ')[0].toLowerCase(),
        params: { prompt: 'Hello world' },
      }));
    return { steps };
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      const definition = buildDefinition();
      await axios.post('/api/workflows/save', { name: 'My Workflow', definition });
      alert('Workflow saved');
    } catch (err) {
      console.error(err);
      alert('Error saving workflow');
    } finally {
      setSaving(false);
    }
  };

  const runWorkflow = async () => {
    setRunning(true);
    try {
      const definition = buildDefinition();
      const res = await axios.post('/api/workflows/run', { definition });
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      alert('Error running workflow');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <button onClick={() => addNode('Text')} className="bg-primary text-white px-3 py-1 rounded">Add Text</button>
        <button onClick={() => addNode('Image')} className="bg-primary text-white px-3 py-1 rounded">Add Image</button>
        <button onClick={() => addNode('Voice')} className="bg-primary text-white px-3 py-1 rounded">Add Voice</button>
        <button onClick={() => addNode('SEO')} className="bg-primary text-white px-3 py-1 rounded">Add SEO</button>
        <button onClick={saveWorkflow} className="bg-green-500 text-white px-3 py-1 rounded" disabled={saving}>Save</button>
        <button onClick={runWorkflow} className="bg-blue-500 text-white px-3 py-1 rounded" disabled={running}>Run</button>
      </div>
      <div style={{ height: 400 }} className="border rounded">
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
            <MiniMap />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      {results && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Workflow Results</h3>
          <ul className="list-disc pl-5 space-y-1">
            {results.map((r, idx) => (
              <li key={idx}>
                <strong>{r.step}:</strong> {typeof r.result === 'object' ? JSON.stringify(r.result) : r.result.toString().substring(0, 100)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkflowBuilder;