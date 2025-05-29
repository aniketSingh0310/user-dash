import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';
import { calculateAge } from '@/lib/utils';
import { format } from 'date-fns';

// Dummy current user ID for follow/unfollow logic
// In a real app, this would come from auth context
const CURRENT_USER_ID = 999; // Replace with actual logged-in user ID logic

const UserCard = ({ user, onDelete, onFollowToggle, isCurrentUserFollowing }) => {
  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : 'N/A';
  const dobFormatted = user.dateOfBirth ? format(new Date(user.dateOfBirth), 'PPP') : 'N/A';

  const handleFollow = () => {
    // Prevent following oneself if user.id could be CURRENT_USER_ID
    if (user.id === CURRENT_USER_ID) return;
    onFollowToggle(CURRENT_USER_ID, user.id, isCurrentUserFollowing);
  };

  return (
    <Card className="w-full max-w-sm flex flex-col">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
          <AvatarImage src={user.profilePicture || 'https://via.placeholder.com/150'} alt={user.name} />
          <AvatarFallback>{user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {dobFormatted}</p>
          <p><strong>Age:</strong> {age}</p>
          <div className="flex justify-around mt-3 pt-3 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-default">
                    <Users className="mx-auto h-5 w-5 mb-1" />
                    <p className="font-semibold">{user.Followers ? user.Followers.length : 0}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.Followers ? user.Followers.length : 0} followers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-default">
                    <UserPlus className="mx-auto h-5 w-5 mb-1" />
                    <p className="font-semibold">{user.Following ? user.Following.length : 0}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.Following ? user.Following.length : 0} following</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
        {user.id !== CURRENT_USER_ID && (
             <Button onClick={handleFollow} variant={isCurrentUserFollowing ? "secondary" : "default"} className="w-full sm:w-auto">
             {isCurrentUserFollowing ? 'Unfollow' : 'Follow'}
           </Button>
        )}
        <div className="flex gap-2 w-full sm:w-auto">
        <Link to={`/edit/${user.id}`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
        </Link>
        <Button variant="destructive" onClick={() => onDelete(user.id)} className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCard; 