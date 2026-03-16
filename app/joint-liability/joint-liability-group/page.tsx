"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, Search, X, UserPlus, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Group, Member } from "@/services/joint-liability";
import { useJointLiabilityGroups } from "@/hooks/useJointLiabilityGroups";
import { useCustomers } from "@/hooks/useCustomers";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function JointLiabilityGroupsPage() {
  const {
    groups,
    loading,
    refetch,
    createGroup,
    deleteGroup,
    distributeCredit,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupById,
  } = useJointLiabilityGroups();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState("");
  const [newMembers, setNewMembers] = useState<
    { name: string; depositAmount: string; role: 'head' | 'member'; customerId?: string; customerName?: string }[]
  >([{ name: "", depositAmount: "", role: "head" }]);

  // Edit Group Form State
  const [editGroupName, setEditGroupName] = useState("");
  const [newMemberToAdd, setNewMemberToAdd] = useState<{ name: string; depositAmount: string; role: 'head' | 'member'; customerId?: string }>({ name: "", depositAmount: "", role: "member" });

  // Distribution State
  const [distributionAmounts, setDistributionAmounts] = useState<{ [key: string]: string }>({});

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });

  // Fetch customers for dropdown
  const { customers, loading: customersLoading } = useCustomers({});
  const { addToast } = useToast();

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddMemberRow = () => {
    if (newMembers.length >= 20) {
      addToast({ type: 'warning', message: 'Maximum 20 members allowed.' });
      return;
    }
    setNewMembers([...newMembers, { name: "", depositAmount: "", role: "member" }]);
  };

  const handleRemoveMemberRow = (index: number) => {
    if (newMembers.length <= 1) return;
    const updated = [...newMembers];
    updated.splice(index, 1);
    
    if (updated.every(m => m.role !== 'head')) {
        updated[0].role = 'head';
    }
    setNewMembers(updated);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...newMembers];
    updated[index] = { ...updated[index], [field]: value };
    setNewMembers(updated);
  };

  const handleCustomerSelect = (index: number, customerId: string) => {
    const customer = customers.find(c => (c._id || c.id || c.customerId) === customerId);
    if (customer) {
      const updated = [...newMembers];
      updated[index] = {
        ...updated[index],
        customerId: customerId,
        customerName: customer.fullName,
        name: customer.fullName
      };
      setNewMembers(updated);
    }
  };

  const handleHeadSelection = (index: number) => {
    const updated = newMembers.map((m, i) => ({
      ...m,
      role: (i === index ? "head" : "member") as 'head' | 'member'
    }));
    setNewMembers(updated);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      addToast({ type: 'error', message: 'Please enter a group name.' });
      return;
    }
    if (newMembers.some(m => !m.name || !m.depositAmount)) {
      addToast({ type: 'error', message: 'Please fill in all member details.' });
      return;
    }

    try {
      const membersPayload = newMembers.map(m => ({
        name: m.name,
        depositAmount: parseFloat(m.depositAmount),
        role: m.role,
        customerId: m.customerId
      }));

      await createGroup({ name: newGroupName.trim(), members: membersPayload });
      setIsCreateModalOpen(false);
      setNewGroupName("");
      setNewMembers([{ name: "", depositAmount: "", role: "head" }]);
      addToast({ type: 'success', message: 'Group created successfully!' });
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', message: 'Failed to create group.' });
    }
  };

  const handleDistribute = async () => {
    if (!selectedGroup) return;

    try {
      const distributions = selectedGroup.members.map(member => ({
        memberId: member.id,
        amount: parseFloat(distributionAmounts[member.id] || member.availableCredit.toString()) || 0
      }));

      await distributeCredit(selectedGroup.id, distributions);
      const updatedGroup = await getGroupById(selectedGroup.id);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
        const amounts: { [key: string]: string } = {};
        updatedGroup.members.forEach(m => {
          amounts[m.id] = m.availableCredit.toString();
        });
        setDistributionAmounts(amounts);
      }
      addToast({ type: 'success', message: 'Credit limits updated successfully!' });
    } catch (error: unknown) {
      addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to distribute credit.' });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Group',
      message: `Are you sure you want to delete "${group?.name || 'this group'}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteGroup(groupId);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          addToast({ type: 'success', message: 'Group deleted successfully!' });
        } catch (error: unknown) {
          addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete group.' });
        }
      }
    });
  };
  
  const openDetails = (group: Group) => {
      setSelectedGroup(group);
      const amounts: {[key: string]: string} = {};
      group.members.forEach(m => {
          amounts[m.id] = m.availableCredit.toString();
      });
      setDistributionAmounts(amounts);
      setIsDetailsModalOpen(true);
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setEditGroupName(group.name);
    setNewMemberToAdd({ name: "", depositAmount: "", role: "member" });
    setIsEditModalOpen(true);
  };

  const handleAddMemberToGroup = async () => {
    if (!selectedGroup) return;

    if (!newMemberToAdd.name || !newMemberToAdd.depositAmount) {
      addToast({ type: 'error', message: 'Please fill in member name and deposit amount.' });
      return;
    }

    if (selectedGroup.members.length >= 20) {
      addToast({ type: 'warning', message: 'Maximum 20 members allowed per group.' });
      return;
    }

    try {
      const updatedGroup = await addMemberToGroup(selectedGroup.id, {
        name: newMemberToAdd.name,
        depositAmount: parseFloat(newMemberToAdd.depositAmount),
        role: newMemberToAdd.role,
        customerId: newMemberToAdd.customerId
      });
      if (updatedGroup) setSelectedGroup(updatedGroup);
      setNewMemberToAdd({ name: "", depositAmount: "", role: "member" });
      addToast({ type: 'success', message: 'Member added successfully!' });
    } catch (error: unknown) {
      addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to add member.' });
    }
  };

  const handleRemoveMemberFromGroup = (memberId: string, memberName: string) => {
    if (!selectedGroup) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Remove Member',
      message: `Are you sure you want to remove ${memberName} from this group?`,
      variant: 'warning',
      onConfirm: async () => {
        try {
          const updatedGroup = await removeMemberFromGroup(selectedGroup.id, memberId);
          if (updatedGroup) setSelectedGroup(updatedGroup);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          addToast({ type: 'success', message: 'Member removed successfully!' });
        } catch (error: unknown) {
          addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to remove member.' });
        }
      }
    });
  };

  const handleCustomerSelectForEdit = (customerId: string) => {
    const customer = customers.find(c => (c._id || c.id || c.customerId) === customerId);
    if (customer) {
      setNewMemberToAdd({
        ...newMemberToAdd,
        customerId: customerId,
        name: customer.fullName
      });
    }
  };

  const getCustomerOptions = () => {
    return customers.map(c => ({
      value: c._id || c.id || c.customerId || '',
      label: `${c.fullName} (${c.memberId || c.phone || ''})`
    }));
  };

  const getAvailableCredit = (member: Member) => {
    return member.availableCredit - member.currentLoanAmount;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Joint Liability Groups</h1>
            <p className="text-neutral-500">Manage groups, members, and credit limits.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
            Create Group
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="sm" className="bg-primary-50 border-primary-100">
            <div className="text-sm text-primary-700 font-medium">Total Groups</div>
            <div className="text-2xl font-bold text-primary-900">{groups.length}</div>
          </Card>
          <Card padding="sm" className="bg-green-50 border-green-100">
            <div className="text-sm text-green-700 font-medium">Total Members</div>
            <div className="text-2xl font-bold text-green-900">
              {groups.reduce((sum, g) => sum + g.members.length, 0)}
            </div>
          </Card>
          <Card padding="sm" className="bg-purple-50 border-purple-100">
            <div className="text-sm text-purple-700 font-medium">Total Deposits</div>
            <div className="text-2xl font-bold text-purple-900">
              ₹{groups.reduce((sum, g) => sum + g.totalDeposit, 0).toLocaleString()}
            </div>
          </Card>
          <Card padding="sm" className="bg-orange-50 border-orange-100">
            <div className="text-sm text-orange-700 font-medium">Total Credit Limit</div>
            <div className="text-2xl font-bold text-orange-900">
              ₹{groups.reduce((sum, g) => sum + g.maxCreditLimit, 0).toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search groups or members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups List */}
        <div className="overflow-x-auto">
          <Table
            data={filteredGroups}
          loading={loading}
          emptyMessage="No joint liability groups created yet."
          columns={[
            { key: "name", header: "Group Name", sortable: true },
            { 
              key: "members", 
              header: "Members", 
              render: (members: Member[]) => (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-500" />
                  <span>{members.length}</span>
                </div>
              )
            },
            { 
              key: "totalDeposit", 
              header: "Total Deposit", 
              render: (val: number) => `₹${val.toLocaleString()}`
            },
            { 
              key: "maxCreditLimit", 
              header: "Max Credit Limit", 
              render: (val: number) => `₹${val.toLocaleString()}`
            },
            {
              key: "distributed",
              header: "Distributed",
              render: (_, group: Group) => {
                const distributed = group.members.reduce((sum, m) => sum + m.availableCredit, 0);
                return (
                  <div className="flex flex-col">
                    <span className="font-medium">₹{distributed.toLocaleString()}</span>
                    <span className="text-xs text-neutral-500">
                      {((distributed / group.maxCreditLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                );
              }
            },
            {
               key: "actions",
               header: "Actions",
               render: (_, group) => (
                 <div className="flex gap-2">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={(e) => {
                       e.stopPropagation();
                       openDetails(group);
                     }}
                   >
                     View
                   </Button>
                   <Button 
                     variant="secondary" 
                     size="sm"
                     onClick={(e) => {
                       e.stopPropagation();
                       openEditModal(group);
                     }}
                   >
                     <Edit2 className="h-4 w-4" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     className="text-error-500 hover:text-error-600 hover:bg-error-50"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteGroup(group.id);
                     }}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               )
            }
          ]}
          onRowClick={(group) => openDetails(group)}
        />
        </div>

        {/* Create Group Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Joint Liability Group"
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </>
          }
        >
          <div className="space-y-6">
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-neutral-900">Members ({newMembers.length}/20)</h4>
                <Button size="sm" variant="secondary" onClick={handleAddMemberRow} icon={<UserPlus className="h-4 w-4" />}>
                  Add Member
                </Button>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-stripe space-y-3 max-h-[400px] overflow-y-auto">
                {newMembers.map((member, index) => (
                  <div key={index} className="flex gap-3 items-end bg-white p-3 rounded-stripe border border-border-light">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Select Customer (Optional)</label>
                      <Select
                        placeholder="Select from customers or enter manually"
                        options={[
                          { value: "", label: "Enter manually" },
                          ...getCustomerOptions()
                        ]}
                        value={member.customerId || ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCustomerSelect(index, e.target.value);
                          } else {
                            handleMemberChange(index, "customerId", "");
                            handleMemberChange(index, "name", "");
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Name</label>
                      <Input
                        placeholder="Member name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        disabled={!!member.customerId}
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Deposit (₹)</label>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={member.depositAmount}
                        onChange={(e) => handleMemberChange(index, "depositAmount", e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="w-24 flex flex-col items-center justify-center pb-2">
                       <label className="text-xs font-medium text-neutral-600 mb-1 block">Head</label>
                       <input 
                          type="radio" 
                          name="groupHead"
                          checked={member.role === 'head'}
                          onChange={() => handleHeadSelection(index)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                       />
                    </div>
                    {newMembers.length > 1 && (
                       <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mb-1 text-error-500 hover:text-error-600 hover:bg-error-50"
                          onClick={() => handleRemoveMemberRow(index)}
                       >
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* Group Details Modal */}
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={selectedGroup?.name || "Group Details"}
          size="xl"
        >
          {selectedGroup && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="sm" className="bg-primary-50 border-primary-100">
                  <div className="text-sm text-primary-700 font-medium">Total Deposit</div>
                  <div className="text-2xl font-bold text-primary-900">₹{selectedGroup.totalDeposit.toLocaleString()}</div>
                </Card>
                <Card padding="sm" className="bg-green-50 border-green-100">
                  <div className="text-sm text-green-700 font-medium">Max Credit Limit</div>
                  <div className="text-2xl font-bold text-green-900">₹{selectedGroup.maxCreditLimit.toLocaleString()}</div>
                </Card>
                <Card padding="sm" className="bg-purple-50 border-purple-100">
                  <div className="text-sm text-purple-700 font-medium">Members</div>
                  <div className="text-2xl font-bold text-purple-900">{selectedGroup.members.length}</div>
                </Card>
                <Card padding="sm" className="bg-orange-50 border-orange-100">
                  <div className="text-sm text-orange-700 font-medium">Distributed</div>
                  <div className="text-2xl font-bold text-orange-900">
                    ₹{selectedGroup.members.reduce((s, m) => s + m.availableCredit, 0).toLocaleString()}
                  </div>
                </Card>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-semibold text-lg">Member Distribution & Status</h4>
                   <div className="text-sm text-neutral-500">
                      Distributed: <span className="font-bold text-neutral-900">
                          ₹{selectedGroup.members.reduce((s, m) => s + m.availableCredit, 0).toLocaleString()}
                      </span>
                      {' / '}
                      {selectedGroup.maxCreditLimit.toLocaleString()}
                   </div>
                </div>
                
                <div className="overflow-x-auto border border-border rounded-stripe">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left">Member</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-right">Deposit</th>
                        <th className="px-4 py-3 text-right">Used Credit</th>
                        <th className="px-4 py-3 text-right">Available</th>
                        <th className="px-4 py-3 text-right w-40">Credit Limit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedGroup.members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-3 font-medium">{member.name}</td>
                          <td className="px-4 py-3">
                              <Badge variant={member.role === 'head' ? 'primary' : 'neutral'} size="sm">
                                  {member.role === 'head' ? 'Head' : 'Member'}
                              </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">₹{member.depositAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-orange-600">₹{member.currentLoanAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-green-600">₹{getAvailableCredit(member).toLocaleString()}</td>
                          <td className="px-4 py-3">
                             <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="h-8 text-right"
                                  value={distributionAmounts[member.id] || ''}
                                  onChange={(e) => setDistributionAmounts({
                                      ...distributionAmounts,
                                      [member.id]: e.target.value
                                  })}
                                  min="0"
                               />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-50 border-t border-border">
                      <tr>
                          <td colSpan={6} className="px-4 py-3 text-right">
                               <Button size="sm" onClick={handleDistribute}>
                                  Update Credit Limits
                               </Button>
                          </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Group Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGroup(null);
            setNewMemberToAdd({ name: "", depositAmount: "", role: "member" });
          }}
          title={`Edit Group: ${selectedGroup?.name || ""}`}
          size="xl"
        >
          {selectedGroup && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="sm" className="bg-primary-50 border-primary-100">
                  <div className="text-sm text-primary-700 font-medium">Total Deposit</div>
                  <div className="text-2xl font-bold text-primary-900">₹{selectedGroup.totalDeposit.toLocaleString()}</div>
                </Card>
                <Card padding="sm" className="bg-green-50 border-green-100">
                  <div className="text-sm text-green-700 font-medium">Max Credit Limit</div>
                  <div className="text-2xl font-bold text-green-900">₹{selectedGroup.maxCreditLimit.toLocaleString()}</div>
                </Card>
                <Card padding="sm" className="bg-purple-50 border-purple-100">
                  <div className="text-sm text-purple-700 font-medium">Current Members</div>
                  <div className="text-2xl font-bold text-purple-900">{selectedGroup.members.length}/20</div>
                </Card>
              </div>

              {/* Existing Members List */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Current Members</h4>
                <div className="border border-border rounded-stripe overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left">Member</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-right">Deposit</th>
                        <th className="px-4 py-3 text-right">Used Credit</th>
                        <th className="px-4 py-3 text-right">Available Credit</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedGroup.members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-3 font-medium">{member.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant={member.role === 'head' ? 'primary' : 'neutral'} size="sm">
                              {member.role === 'head' ? 'Head' : 'Member'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">₹{member.depositAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-orange-600">₹{member.currentLoanAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-green-600">₹{getAvailableCredit(member).toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-error-500 hover:text-error-600 hover:bg-error-50"
                              onClick={() => handleRemoveMemberFromGroup(member.id, member.name)}
                              disabled={member.currentLoanAmount > 0 || member.availableCredit > 0}
                              title={
                                member.currentLoanAmount > 0 
                                  ? "Cannot remove member with active loans"
                                  : member.availableCredit > 0
                                  ? "Cannot remove member with distributed credit"
                                  : "Remove member"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Member Section */}
              <div className="border-t border-border pt-6">
                <h4 className="font-semibold text-lg mb-4">Add New Member</h4>
                <div className="bg-neutral-50 p-4 rounded-stripe space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Select Customer (Optional)</label>
                      <Select
                        placeholder="Select from customers or enter manually"
                        options={[
                          { value: "", label: "Enter manually" },
                          ...getCustomerOptions()
                        ]}
                        value={newMemberToAdd.customerId || ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCustomerSelectForEdit(e.target.value);
                          } else {
                            setNewMemberToAdd({ ...newMemberToAdd, customerId: "", name: "" });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Member Name</label>
                      <Input
                        placeholder="Member name"
                        value={newMemberToAdd.name}
                        onChange={(e) => setNewMemberToAdd({ ...newMemberToAdd, name: e.target.value })}
                        disabled={!!newMemberToAdd.customerId}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Deposit Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter deposit amount"
                        value={newMemberToAdd.depositAmount}
                        onChange={(e) => setNewMemberToAdd({ ...newMemberToAdd, depositAmount: e.target.value })}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 mb-1 block">Role</label>
                      <Select
                        options={[
                          { value: "member", label: "Member" },
                          { value: "head", label: "Head (will replace current head)" }
                        ]}
                        value={newMemberToAdd.role}
                        onChange={(e) => setNewMemberToAdd({ ...newMemberToAdd, role: e.target.value as 'head' | 'member' })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddMemberToGroup}
                      disabled={selectedGroup.members.length >= 20}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  {selectedGroup.members.length >= 20 && (
                    <p className="text-sm text-warning-600 text-center">
                      Maximum 20 members reached. Remove a member first to add a new one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant={confirmDialog.variant}
          confirmText="Confirm"
          cancelText="Cancel"
        />
      </div>
    </DashboardLayout>
  );
}
