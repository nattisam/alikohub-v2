import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, CreditCard } from 'lucide-react';
import { useEnrollment } from '@/hooks/useEnrollment';
import { useUser } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    price: number;
    duration: string;
    students: number;
    rating: number;
    instructor: string;
    category: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { mutate: enroll, isPending } = useEnrollment();
  const { data: user } = useUser();

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please login to enroll in this course');
      return;
    }

    enroll({ courseId: course.id, paymentGateway: 'CHAPA' });
  };

  const isEnrolled = user?.enrollments?.some((enrollment: { courseId: number }) => enrollment.courseId === course.id);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {course.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.students} students
          </div>
        </div>

        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">Instructor</p>
          <p className="font-medium">{course.instructor}</p>
        </div>

        <div className="text-center py-2 border-y">
          <p className="text-2xl font-bold text-primary">${course.price}</p>
          <p className="text-sm text-muted-foreground">One-time payment</p>
        </div>

        <Button 
          onClick={handleEnroll}
          disabled={isPending || isEnrolled}
          className="w-full"
          size="lg"
        >
          {isEnrolled ? (
            'Already Enrolled'
          ) : isPending ? (
            <>
              <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Enroll Now
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure payment via Chapa. Instant access after payment.
        </p>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
