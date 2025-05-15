package com.belweather

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.AlarmClock
import android.util.Log
import android.widget.RemoteViews
import androidx.work.Constraints
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.OutOfQuotaPolicy
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters

class WeatherClassicWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            val weatherPendingIntent = PendingIntent.getActivity(
                context, 0,
                Intent(context, MainActivity::class.java),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val timePendingIntent = PendingIntent.getActivity(
                context, 1,
                Intent(AlarmClock.ACTION_SHOW_ALARMS),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val calendarPendingIntent = PendingIntent.getActivity(
                context, 2,
                Intent(Intent.ACTION_VIEW).apply {
                    data = Uri.parse("content://com.android.calendar/time")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                },
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.weather_classic_widget).apply {
                    setOnClickPendingIntent(R.id.weather_view, weatherPendingIntent)
                    setOnClickPendingIntent(R.id.time_text, timePendingIntent)
                    setOnClickPendingIntent(R.id.date_text, calendarPendingIntent)
                }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        /*
        * TODO: IT IS IMPOSSIBLE TO UPDATE WIDGET BY RUNNING JAVASCRIPT CODE
        *  IN ANY TIME BECAUSE OF ANDROID RESTRICTIONS
        *  For better development experience rewrite services on Kotlin
        * */
        // Maybe it works...
        val workRequest = OneTimeWorkRequestBuilder<WidgetInitWorker>()
            .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
            .build()

        WorkManager.getInstance(context).enqueue(workRequest)
    }
}

class WidgetInitWorker(val appContext: Context, workerParams: WorkerParameters)
    : Worker(appContext, workerParams) {
    override fun doWork(): Result {
        val intent = Intent(appContext, WidgetInitService::class.java)
        try {
            appContext.startService(intent)
        } catch (e: Exception) {
            Log.e("AniWeather", "Widget initialization failed: ${e.message}")
            return Result.failure()
        }
        return Result.success()
    }

}