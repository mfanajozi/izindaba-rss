import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Category } from '../types';

interface AddFeedFormProps {
  categories: Category[];
  onAddFeed: (url: string, category: string, title: string) => void;
}

export function AddFeedForm({ categories, onAddFeed }: AddFeedFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && category) {
      onAddFeed(url.trim(), category, title.trim() || 'Untitled Feed');
      setUrl('');
      setTitle('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200 px-8 py-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New RSS Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-slate-800">Add New RSS Feed</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="url" className="text-slate-700">RSS Feed URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/feed"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <Label htmlFor="title" className="text-slate-700">Feed Title (Optional)</Label>
            <Input
              id="title"
              type="text"
              placeholder="My Favorite Feed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-slate-700">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 focus:ring-emerald-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feed
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-slate-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}