import { http, HttpResponse } from 'msw';
import { passthrough } from 'msw'



import {
  USER_MAIN_DATA,
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_PERFORMANCE
} from './data';

export const handlers = [

  // Infos principales de l'utilisateur
  http.get('/mock/user/:id', ({ params }) => {
    const user = USER_MAIN_DATA.find((u) => u.id === parseInt(params.id));
    if (!user) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // Activité quotidienne
  http.get('/mock/user/:id/activity', ({ params }) => {
    const activity = USER_ACTIVITY.find((a) => a.userId === parseInt(params.id));
    if (!activity) {
      return HttpResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return HttpResponse.json(activity);
  }),

  // Moyenne des sessions
  http.get('/mock/user/:id/average-sessions', ({ params }) => {
    const avg = USER_AVERAGE_SESSIONS.find((a) => a.userId === parseInt(params.id));
    if (!avg) {
      return HttpResponse.json({ error: 'Average sessions not found' }, { status: 404 });
    }

    return HttpResponse.json(avg);
  }),

  // Performance
  http.get('/mock/user/:id/performance', ({ params }) => {
    const perf = USER_PERFORMANCE.find((p) => p.userId === parseInt(params.id));
    if (!perf) {
      return HttpResponse.json({ error: 'Performance not found' }, { status: 404 });
    }

    return HttpResponse.json(perf);
  }),
];