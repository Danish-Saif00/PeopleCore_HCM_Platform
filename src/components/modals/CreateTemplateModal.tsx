'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';

interface TaskRow {
  id: string;
  title: string;
  description: string;
  dueOffsetDays: number;
  assignedRole: 'Employee' | 'IT' | 'HR';
}

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: 'Employee', label: 'Employee' },
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
];

export function CreateTemplateModal({
  open,
  onClose,
  onSuccess,
}: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: '1',
      title: '',
      description: '',
      dueOffsetDays: 1,
      assignedRole: 'Employee',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const addTask = () =>
    setTasks((t) => [
      ...t,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        dueOffsetDays: 1,
        assignedRole: 'Employee',
      },
    ]);

  const removeTask = (id: string) =>
    setTasks((t) => t.filter((task) => task.id !== id));

  const updateTask = (
    id: string,
    key: keyof TaskRow,
    val: string | number
  ) =>
    setTasks((t) =>
      t.map((task) => (task.id === id ? { ...task, [key]: val } : task))
    );

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Template name is required.');
      return;
    }
    setNameError('');
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-template', name, tasks }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setTasks([
          {
            id: '1',
            title: '',
            description: '',
            dueOffsetDays: 1,
            assignedRole: 'Employee',
          },
        ]);
        onSuccess();
        onClose();
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Onboarding Template"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} id="save-template">
            Create Template
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          id="template-name"
          label="Template Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError('');
          }}
          error={nameError}
          placeholder="e.g. Software Engineer Onboarding"
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="form-label">Tasks</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={addTask}
              icon={<Plus size={14} />}
            >
              Add Task
            </Button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-[color:var(--border)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[color:var(--muted-foreground)]">
                    Task {idx + 1}
                  </span>
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-[color:var(--danger)] hover:opacity-70"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <Input
                  label="Title"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  placeholder="Task title"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Due (days after start)"
                    type="number"
                    min={1}
                    value={task.dueOffsetDays}
                    onChange={(e) =>
                      updateTask(
                        task.id,
                        'dueOffsetDays',
                        Number(e.target.value)
                      )
                    }
                  />
                  <Select
                    label="Assigned Role"
                    options={ROLE_OPTIONS}
                    value={task.assignedRole}
                    onChange={(e) =>
                      updateTask(task.id, 'assignedRole', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
