"use client";

import { useState } from "react";
import AccountCard from "./AccountCard";
import AddUserModal from "../modals/AddUserModal";
import AddAccountModal from "../modals/AddAccountModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal"; // New confirmation modal
import { Users, Send, Plus, Trash2 } from "lucide-react";

// Define types for better state management
type UserItem = { id: number; name: string; status: "active" | "pending" | "inactive" };
type AccountItem = { id: number; name: string; status: "active" | "pending" | "inactive"; platform: string };

export default function AccountsSection() {
  // State for modals visibility
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "user" | "account"; id: number; name: string } | null>(null);

  // State for actual data lists (Initialized with mock data)
  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: "09123456789", status: "active" },
    { id: 2, name: "09987654321", status: "pending" },
  ]);

  const [accounts, setAccounts] = useState<AccountItem[]>([
    { id: 1, name: "@mychannel", status: "active", platform: "تلگرام" },
    { id: 2, name: "@mypage", status: "inactive", platform: "اینستاگرام" },
  ]);

  // Handle adding a new user from the modal
  const handleAddUser = (phoneNumber: string) => {
    const newUser: UserItem = {
      id: Date.now(), // Generate unique ID
      name: phoneNumber,
      status: "active",
    };
    setUsers((prev) => [...prev, newUser]);
  };

  // Handle deleting an item after confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === "user") {
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
    } else {
      setAccounts((prev) => prev.filter((a) => a.id !== deleteConfirm.id));
    }
    
    setDeleteConfirm(null); // Close confirmation modal
  };

  return (
    <div className="space-y-8">
      {/* --- Users Section --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-text-primary">شماره‌های من</h2>
          </div>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <Plus className="h-4 w-4" />
            افزودن شماره
          </button>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="relative group">
              <AccountCard type="user" name={user.name} status={user.status} />
              
              {/* Delete Button (Visible on Hover) */}
              <button
                onClick={() => setDeleteConfirm({ type: "user", id: user.id, name: user.name })}
                className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="حذف شماره"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-surface-soft p-8 text-center">
              <p className="text-sm text-text-secondary">هنوز شماره‌ای اضافه نکرده‌اید</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Accounts Section --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-bold text-text-primary">اکانت‌های متصل</h2>
          </div>
          <button 
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <Plus className="h-4 w-4" />
            اتصال اکانت
          </button>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="relative group">
              <AccountCard type="account" name={account.name} status={account.status} platform={account.platform} />
              
              {/* Delete Button (Visible on Hover) */}
              <button
                onClick={() => setDeleteConfirm({ type: "account", id: account.id, name: account.name })}
                className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="قطع اتصال"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {accounts.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-surface-soft p-8 text-center">
              <p className="text-sm text-text-secondary">هنوز اکانتی متصل نکرده‌اید</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Pass the callback to add user to the list */}
      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        onAddSuccess={handleAddUser} 
      />
      
      <AddAccountModal 
        isOpen={showAddAccountModal} 
        onClose={() => setShowAddAccountModal(false)} 
      />

      {/* Confirmation Modal for Deletion */}
      {deleteConfirm && (
        <ConfirmDeleteModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteConfirm.name}
          itemType={deleteConfirm.type === "user" ? "شماره تلفن" : "اکانت"}
        />
      )}
    </div>
  );
}