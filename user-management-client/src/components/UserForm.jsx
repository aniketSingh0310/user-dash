import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const UserForm = ({ existingUser, onSubmit, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  // const [profilePicture, setProfilePicture] = useState(null); // For file upload later
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name || '');
      setEmail(existingUser.email || '');
      setPhone(existingUser.phone || '');
      setDateOfBirth(existingUser.dateOfBirth ? new Date(existingUser.dateOfBirth) : null);
    }
  }, [existingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    try {
      await onSubmit({
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
      });
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isEditMode ? 'Edit User' : 'Create New User'}
      </h2>
      
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890"
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateOfBirth}
              onSelect={setDateOfBirth}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Placeholder for profile picture upload */}
      {/* Firebase integration will go here */}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit">{isEditMode ? 'Save Changes' : 'Create User'}</Button>
      </div>
    </form>
  );
};

export default UserForm; 