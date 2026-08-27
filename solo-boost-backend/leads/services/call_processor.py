from django.db import models, transaction

from leads.services.ai_analyzer import analyze_call


from leads.models import FollowUp



@transaction.atomic
def process_completed_call(call):
    if not call.transcript:
        return None

    analysis = analyze_call(call.transcript)

    lead = call.lead

    # Update Lead
    lead.status = analysis["lead_status"]
    lead.lead_score = analysis["lead_score"]

    lead.save(update_fields=[
        "status",
        "lead_score",
        "updated_at",
    ])

    # Update Call
    call.result = analysis["call_result"]
    call.summary = analysis["summary"]

    call.save(update_fields=[
        "result",
        "summary",
        "updated_at",
    ])

    if not call.transcript:
        return None

    analysis = analyze_call(call.transcript)

    lead = call.lead

    # -------------------------
    # Update Lead
    # -------------------------

    lead.status = analysis["lead_status"]
    lead.lead_score = analysis["lead_score"]

    lead.save(update_fields=[
        "status",
        "lead_score",
        "updated_at",
    ])

    # -------------------------
    # Update Call
    # -------------------------

    call.result = analysis["call_result"]
    call.summary = analysis["summary"]

    call.save(update_fields=[
        "result",
        "summary",
        "updated_at",
    ])
    from leads.models import FollowUp

    # -------------------------
    # Create FollowUp
    # -------------------------

    if analysis["follow_up_required"]:
        FollowUp.objects.create(
            lead=lead,
            title=analysis["follow_up_title"] or "Follow up with lead",
            notes=analysis["follow_up_notes"] or "",
            due_date=analysis["follow_up_date"],
        )
        # We need a date before creating FollowUp
        if analysis["follow_up_date"]:
            FollowUp.objects.create(
                lead=lead,
                title=analysis["follow_up_title"] or "Follow up with lead",
                notes=analysis["follow_up_notes"] or "",
                due_date=analysis["follow_up_date"],
            )

    return analysis

    

