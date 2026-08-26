from django.db import models
from django.contrib.auth.models import User


class Lead(models.Model):

    class Status(models.TextChoices):
        NEW = 'New', 'New'
        CONTACTED = 'Contacted', 'Contacted'
        INTRESTED = 'Interested', 'Interested'
        MEETING = 'Meeting', 'Meeting'
        LOST = 'Lost', 'Lost'
        PROPOSAL = 'Proposal', 'Proposal'
        WON = 'Won', 'Won'

    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'

    class Source(models.TextChoices):
        GOOGLE_MAPS = "google_maps", "Google Maps"
        LINKEDIN = "linkedin", "LinkedIn"
        REFERRAL = "referral", "Referral"
        JOB_BOARD = "job_board", "Job Board"
        MANUAL = "manual", "Manual"
        OTHER = "other", "Other"



    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='leads'
    )

    business_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=150, blank=True)

    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    website = models.URLField(blank=True)
    google_maps_url = models.URLField(blank=True)

    location = models.CharField(max_length=255, blank=True)

    lead_score = models.PositiveIntegerField(default=0)

    notes = models.TextField(blank=True)
    status = models.CharField(
    max_length=20,
    choices=Status.choices,
    default=Status.NEW
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.MANUAL
    )

    service = models.CharField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name


class FollowUp(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="followups"
    )

    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)

    due_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    
class Call(models.Model):

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    class Result(models.TextChoices):
        INTERESTED = "interested", "Interested"
        NOT_INTERESTED = "not_interested", "Not Interested"
        FOLLOW_UP = "follow_up", "Follow Up"
        NO_ANSWER = "no_answer", "No Answer"
        WRONG_NUMBER = "wrong_number", "Wrong Number"
        MEETING_BOOKED = "meeting_booked", "Meeting Booked"

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="calls"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )

    result = models.CharField(
        max_length=30,
        choices=Result.choices,
        blank=True
    )

    scheduled_at = models.DateTimeField()

    started_at = models.DateTimeField(
        null=True,
        blank=True
    )

    ended_at = models.DateTimeField(
        null=True,
        blank=True
    )

    duration = models.PositiveIntegerField(
        default=0,
        help_text="Duration in seconds"
    )

    transcript = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Call - {self.lead.business_name}"