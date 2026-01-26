import React, { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  isbn: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
}

interface Circulation {
  id: string;
  bookTitle: string;
  studentName: string;
  checkoutDate: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'returned';
}

export const LibraryManagement: React.FC = () => {
  const [view, setView] = useState<'books' | 'checkout' | 'overdue'>('books');
  const [showForm, setShowForm] = useState(false);

  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'The Great Gatsby', isbn: '9780743273565', author: 'F. Scott Fitzgerald', totalCopies: 10, availableCopies: 3 },
    { id: '2', title: 'Pride and Prejudice', isbn: '9780141439518', author: 'Jane Austen', totalCopies: 8, availableCopies: 2 }
  ]);

  const [circulation, setCirculation] = useState<Circulation[]>([
    { id: '1', bookTitle: 'The Great Gatsby', studentName: 'Ritik Koley', checkoutDate: '2024-01-10', dueDate: '2024-02-10', status: 'active' },
    { id: '2', bookTitle: 'To Kill a Mockingbird', studentName: 'Aditya Singh', checkoutDate: '2024-01-01', dueDate: '2024-01-20', status: 'overdue' }
  ]);

  const [form, setForm] = useState({ title: '', isbn: '', author: '', copies: '' });

  const handleAddBook = () => {
    if (form.title && form.isbn && form.author && form.copies) {
      const newBook: Book = {
        id: String(books.length + 1),
        title: form.title,
        isbn: form.isbn,
        author: form.author,
        totalCopies: parseInt(form.copies),
        availableCopies: parseInt(form.copies)
      };
      setBooks([...books, newBook]);
      setForm({ title: '', isbn: '', author: '', copies: '' });
      setShowForm(false);
    }
  };

  const overdueCount = circulation.filter(c => c.status === 'overdue').length;
  const checkedOutCount = circulation.filter(c => c.status === 'active').length;
  const totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0);

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Library Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Catalog, circulation, fines & reservations
              </p>
            </div>
          </div>
          {view === 'books' && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Book</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Books</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{books.length}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Checked Out</p>
          <p className="text-2xl font-bold text-blue-500">{checkedOutCount}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Overdue</p>
          <p className="text-2xl font-bold text-red-500">{overdueCount}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Available</p>
          <p className="text-2xl font-bold text-green-500">{totalAvailable}</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['books', 'checkout', 'overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                view === tab
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {view === 'books' && (
          <div className="space-y-3">
            {books.map(book => (
              <div key={book.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <p className="font-medium text-apple-gray-600 dark:text-white">{book.title}</p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{book.author}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-apple-gray-500">ISBN: {book.isbn}</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{book.availableCopies}/{book.totalCopies} available</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'checkout' && (
          <div className="space-y-3">
            {circulation.filter(c => c.status === 'active').map(item => (
              <div key={item.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="font-medium text-apple-gray-600 dark:text-white">{item.bookTitle}</p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{item.studentName}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-apple-gray-500">Since: {item.checkoutDate}</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Due: {item.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'overdue' && (
          <div className="space-y-3">
            {circulation.filter(c => c.status === 'overdue').map(item => (
              <div key={item.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <p className="font-medium text-red-700 dark:text-red-400">{item.bookTitle}</p>
                <p className="text-sm text-red-600 dark:text-red-300">{item.studentName}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-red-500">Due since: {item.dueDate}</span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">OVERDUE</span>
                </div>
              </div>
            ))}
            {circulation.filter(c => c.status === 'overdue').length === 0 && (
              <p className="text-center py-8 text-apple-gray-400">No overdue books</p>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Add New Book</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Book Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="ISBN"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Number of Copies"
                value={form.copies}
                onChange={(e) => setForm({ ...form, copies: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAddBook}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
