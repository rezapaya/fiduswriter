#
# This file is part of Fidus Writer <http://www.fiduswriter.org>
#
# Copyright (C) 2013 Takuto Kojima, Johannes Wilm
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core.mail import send_mail
from django.core.context_processors import csrf
from django.template import RequestContext

from feedback.models import Feedback

def feedback(request):
    status = 405
    if request.is_ajax() and request.method == 'POST':
        status = 200
        feedback_message = request.POST['message']
        feedback_owner = request.user
        new_feedback = Feedback()
        new_feedback.message = feedback_message
        if request.user.is_authenticated():
            new_feedback.owner = request.user
        new_feedback.save()
        
    return HttpResponse(status=status)            

    
def browser(request):
    response={}
    response['user'] = request.user
    response.update(csrf(request))
    return render_to_response('feedback/browser.html', 
        response,
        context_instance=RequestContext(request))
