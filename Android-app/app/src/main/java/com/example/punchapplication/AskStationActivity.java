package com.example.punchapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;


public class AskStationActivity extends AppCompatActivity {
/**
 *  This activity is only used to ask the user on what station he is currently operating
 * It should later be a login activity for improved security!
 */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ask_station);
    }

    public void punchStation(View view) {
        String station = "punch";
        Intent intent = new Intent(this, BarcodeCaptureActivity.class);
        intent.putExtra("station", station);
        startActivity(intent);
    }

    public void bendStation(View view) {
        String station = "Bend";
        Intent intent = new Intent(this, BarcodeCaptureActivity.class);
        intent.putExtra("station", station);
        startActivity(intent);
    }
}
