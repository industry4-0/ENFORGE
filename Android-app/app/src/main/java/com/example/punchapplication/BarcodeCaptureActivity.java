package com.example.punchapplication;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.JsonObject;
import com.scandit.datacapture.barcode.capture.BarcodeCapture;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureListener;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSession;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSettings;
import com.scandit.datacapture.barcode.capture.SymbologySettings;
import com.scandit.datacapture.barcode.data.Barcode;
import com.scandit.datacapture.barcode.data.Symbology;
import com.scandit.datacapture.barcode.data.SymbologyDescription;
import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlay;
import com.scandit.datacapture.core.capture.DataCaptureContext;
import com.scandit.datacapture.core.data.FrameData;
import com.scandit.datacapture.core.source.Camera;
import com.scandit.datacapture.core.source.FrameSourceState;
import com.scandit.datacapture.core.ui.DataCaptureView;
import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinder;

import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

public class BarcodeCaptureActivity extends CameraPermissionActivity implements BarcodeCaptureListener {
    /**
     * This activity is basically the main Activity where the scanning takes place
     * It also asks for Permissions: camera
     * 
     * 
     * 
     */


    public static final String SCANDIT_LICENSE_KEY = "You license key here";
    private DataCaptureContext dataCaptureContext;
    private BarcodeCapture barcodeCapture;
    private Camera camera;
    private DataCaptureView dataCaptureView;

    private AlertDialog dialog;



    private RequestQueue requestQueue;

    private static BarcodeCaptureActivity mInstance;

    String station;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Get the Intent that started this activity and extract the string
        Intent intent = getIntent();
        this.station = intent.getStringExtra("station");

        // Capture the layout's TextView and set the string as its text
        //Toast.makeText(this, "You are on "+station, Toast.LENGTH_SHORT).show();
        mInstance = this;
        initializeAndStartBarcodeScanning();
    }

    //volley request
    public static synchronized BarcodeCaptureActivity getInstance() {
        return mInstance;
    }

    /*
    Create a getRequestQueue() method to return the instance of
    RequestQueue.This kind of implementation ensures that
    the variable is instatiated only once and the same
    instance is used throughout the application
    */
    public RequestQueue getRequestQueue() {
        if (requestQueue == null)
            requestQueue = Volley.newRequestQueue(getApplicationContext());
        return requestQueue;
    }

    /*
    public method to add the Request to the the single
    instance of RequestQueue created above.Setting a tag to every
    request helps in grouping them. Tags act as identifier
    for requests and can be used while cancelling them
    */
    public void addToRequestQueue(Request request, String tag) {
        request.setTag(tag);
        getRequestQueue().add(request);
    }

    /*
    Cancel all the requests matching with the given tag
    */
    public void cancelAllRequests(String tag) {
        getRequestQueue().cancelAll(tag);
    }

    private void initializeAndStartBarcodeScanning() {
        // Create data capture context using your license key.
        dataCaptureContext = DataCaptureContext.forLicenseKey(SCANDIT_LICENSE_KEY);

        // Use the default camera and set it as the frame source of the context.
        // The camera is off by default and must be turned on to start streaming frames to the data
        // capture context for recognition.
        // See resumeFrameSource and pauseFrameSource below.
        camera = Camera.getDefaultCamera();
        if (camera != null) {
            // Use the recommended camera settings for the BarcodeCapture mode.
            camera.applySettings(BarcodeCapture.createRecommendedCameraSettings());
            dataCaptureContext.setFrameSource(camera);
        } else {
            throw new IllegalStateException("Sample depends on a camera, which failed to initialize.");
        }

        // The barcode capturing process is configured through barcode capture settings
        // which are then applied to the barcode capture instance that manages barcode recognition.
        BarcodeCaptureSettings barcodeCaptureSettings = new BarcodeCaptureSettings();

        // The settings instance initially has all types of barcodes (symbologies) disabled.
        // For the purpose of this sample we enable a very generous set of symbologies.
        // In your own app ensure that you only enable the symbologies that your app requires as
        // every additional enabled symbology has an impact on processing times.
        HashSet<Symbology> symbologies = new HashSet<>();
        symbologies.add(Symbology.DOT_CODE);

        barcodeCaptureSettings.enableSymbologies(symbologies);

        // Some linear/1d barcode symbologies allow you to encode variable-length data.
        // By default, the Scandit Data Capture SDK only scans barcodes in a certain length range.
        // If your application requires scanning of one of these symbologies, and the length is
        // falling outside the default range, you may need to adjust the "active symbol counts"
        // for this symbology. This is shown in the following few lines of code for one of the
        // variable-length symbologies.
        SymbologySettings symbologySettings =
                barcodeCaptureSettings.getSymbologySettings(Symbology.CODE39);

        HashSet<Short> activeSymbolCounts = new HashSet<>(
                Arrays.asList(new Short[]{7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}));

        symbologySettings.setActiveSymbolCounts(activeSymbolCounts);

        // Create new barcode capture mode with the settings from above.
        barcodeCapture = BarcodeCapture.forDataCaptureContext(dataCaptureContext, barcodeCaptureSettings);

        // Register self as a listener to get informed whenever a new barcode got recognized.
        barcodeCapture.addListener(this);

        // To visualize the on-going barcode capturing process on screen, setup a data capture view
        // that renders the camera preview. The view must be connected to the data capture context.
        dataCaptureView = DataCaptureView.newInstance(this, dataCaptureContext);

        // Add a barcode capture overlay to the data capture view to render the location of captured
        // barcodes on top of the video preview.
        // This is optional, but recommended for better visual feedback.
        BarcodeCaptureOverlay overlay = BarcodeCaptureOverlay.newInstance(barcodeCapture, dataCaptureView);
        overlay.setViewfinder(new RectangularViewfinder());

        setContentView(dataCaptureView);
    }

    @Override
    protected void onPause() {
        pauseFrameSource();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        barcodeCapture.removeListener(this);
        dataCaptureContext.removeMode(barcodeCapture);
        super.onDestroy();
    }

    private void pauseFrameSource() {
        // Switch camera off to stop streaming frames.
        // The camera is stopped asynchronously and will take some time to completely turn off.
        // Until it is completely stopped, it is still possible to receive further results, hence
        // it's a good idea to first disable barcode capture as well.
        barcodeCapture.setEnabled(false);
        camera.switchToDesiredState(FrameSourceState.OFF, null);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Check for camera permission and request it, if it hasn't yet been granted.
        // Once we have the permission the onCameraPermissionGranted() method will be called.
        requestCameraPermission();
    }

    @Override
    public void onCameraPermissionGranted() {
        resumeFrameSource();
    }


    private void resumeFrameSource() {
        dismissScannedCodesDialog();

        // Switch camera on to start streaming frames.
        // The camera is started asynchronously and will take some time to completely turn on.
        barcodeCapture.setEnabled(true);
        camera.switchToDesiredState(FrameSourceState.ON, null);
    }

    private void dismissScannedCodesDialog() {
        if (dialog != null) {
            dialog.dismiss();
            dialog = null;
        }
    }

    private void showResult(String result) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        dialog = builder.setCancelable(false)
                .setTitle(result)
                .setPositiveButton(android.R.string.ok,
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                barcodeCapture.setEnabled(true);
                            }
                        })
                .create();
        dialog.show();
    }


    @Override
    public void onBarcodeScanned(
            @NotNull BarcodeCapture barcodeCapture,
            @NotNull BarcodeCaptureSession session,
            @NotNull FrameData frameData) {

        if (session.getNewlyRecognizedBarcodes().isEmpty()) return;

        Barcode barcode = session.getNewlyRecognizedBarcodes().get(0);

        // Stop recognizing barcodes for as long as we are displaying the result. There won't be any
        // new results until the capture mode is enabled again. Note that disabling the capture mode
        // does not stop the camera, the camera continues to stream frames until it is turned off.
        barcodeCapture.setEnabled(false);

        // If you are not disabling barcode capture here and want to continue scanning, consider
        // setting the codeDuplicateFilter when creating the barcode capture settings to around 500
        // or even -1 if you do not want codes to be scanned more than once.

        // Get the human readable name of the symbology and assemble the result to be shown.
        String symbology = SymbologyDescription.create(barcode.getSymbology()).getReadableName();
        final String designPartId = barcode.getData().trim();
        JSONObject designPartJson = new JSONObject();
        //make get request
        getDesignPartById(designPartId);
        //designPartJson = globalDesinPart;
        //System.out.println("THis is the result : " + result);
        //System.out.println("This is the bardcode.getData() : " + barcode.getData());

        //This is the old dialog
       /* runOnUiThread(new Runnable() {
            @Override
            public void run() {
                confirmationDialog(result);
            }
        });


        */

        /* Scan the dot code!
         * make a get request getDesignPartById(...)
         * update stock collection that u made a part with this id,....
         * update task collection that u completed the task: station = punch, designPartId,status  = completed
         *
         */


        //1. Scan the dot code
        //2. disable the scanner
        //3. get the designPart id from the dotcode
        //4. make the get request with the design part id
        //5. show the user the get request data.partName and data.type
        //6. make a post request to api with the data
        //7. enable the scanner again(if 3 seconds have passed)
    }

    public void updateStock(JSONObject response){
        try{
            JSONObject updateStock = new JSONObject();
            String url = "https://develop.enforge.io/api/stock";
            if (this.station.equals("Bend")){
                updateStock.put("quantity", 1);
            }else {
                updateStock.put("quantity", 0);

            }

            updateStock.put("name", response.get("partName"));
            updateStock.put("part_id", response.get("partId"));
            updateStock.put("type", response.get("type"));
            updateStock.put("itemCode", response.get("itemCode"));
            updateStock.put("forSale", false);
            updateStock.put("parametric", response.get("parametric"));
            updateStock.put("makeorbuy", "make");
            updateStock.put("params", response.get("params"));

            JsonObjectRequest postNewStock = new JsonObjectRequest(Request.Method.POST,
                    url, updateStock,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            System.out.println("everything went ok: "+response.toString());
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("This is the error: "+error);
                    //maybe throw error here for better error handling
                }
            }){
                /** Passing some request headers* */
                @Override
                public Map getHeaders() throws AuthFailureError {
                    HashMap headers = new HashMap();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "basic bearer token");
                    return headers;
                }
            };
            BarcodeCaptureActivity.getInstance().addToRequestQueue(postNewStock, "postRequestStock");

        }catch (Exception exc){
            exc.printStackTrace();
        }
    }
    public void updateTask(String designPartId){
        if (designPartId == null)
            throw new NullPointerException("designPartId is null in updateTask");
        try{
            JSONObject updateTask = new JSONObject();
            String url = "https://develop.enforge.io/api/tasks/customer/"+designPartId;
            System.out.println("this is the station: "+this.station);

            updateTask.put("station", this.station);
            updateTask.put("status", "Completed");
            updateTask.put("made", 1);

            JsonObjectRequest putTask = new JsonObjectRequest(Request.Method.PUT,
                    url, updateTask,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            System.out.println("everything went ok: "+response.toString());
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("This is the error: "+error);
                    //maybe throw error here for better error handling
                }
            }){
                /** Passing some request headers* */
                @Override
                public Map getHeaders() throws AuthFailureError {
                    HashMap headers = new HashMap();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "basic bearer token");
                    return headers;
                }
            };
            BarcodeCaptureActivity.getInstance().addToRequestQueue(putTask, "putRequestTask");
        }catch (Exception exc){
            exc.printStackTrace();
        }
    }

    public void updateFailedTask(String designPartId){
        if (designPartId == null)
            throw new NullPointerException("designPartId is null in updateTask");
        System.out.println("canceling this ! "+designPartId);
        try{
            JSONObject updateTask = new JSONObject();
            String url = "https://develop.enforge.io/api/tasks/customer/"+designPartId;
            System.out.println("this is the station: "+this.station);

            updateTask.put("station", this.station);
            updateTask.put("status", "Failed");
            updateTask.put("made", 0);

            JsonObjectRequest putStock = new JsonObjectRequest(Request.Method.PUT,
                    url, updateTask,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            System.out.println("everything went ok: "+response.toString());
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("This is the error: "+error.getCause());
                    System.out.println("This is the error: "+error.getMessage());
                    System.out.println("This is the error: "+error.getStackTrace());
                    error.printStackTrace();
                    //maybe throw error here for better error handling
                }
            }){
                /** Passing some request headers* */
                @Override
                public Map getHeaders() throws AuthFailureError {
                    HashMap headers = new HashMap();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "basic bearer token");
                    return headers;
                }
            };
            BarcodeCaptureActivity.getInstance().addToRequestQueue(putStock, "putRequestTaskFailed");
        }catch (Exception exc){
            exc.printStackTrace();
        }
    }

    public void updateFailedStock(JSONObject response){
        try{
            JSONObject updateStock = new JSONObject();
            String url = "https://develop.enforge.io/api/stock";
            if (this.station.equals("Bend")){
                updateStock.put("quantity", -1);
            }else {
                updateStock.put("quantity", 0);

            }

            updateStock.put("name", response.get("partName"));
            updateStock.put("part_id", response.get("partId"));
            updateStock.put("type", response.get("type"));
            updateStock.put("itemCode", response.get("itemCode"));
            updateStock.put("forSale", false);
            updateStock.put("parametric", response.get("parametric"));
            updateStock.put("makeorbuy", "make");
            updateStock.put("params", response.get("params"));

            JsonObjectRequest postNewStock = new JsonObjectRequest(Request.Method.POST,
                    url, updateStock,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            System.out.println("everything went ok: "+response.toString());
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("This is the error: "+error);
                    //maybe throw error here for better error handling
                }
            }){
                /** Passing some request headers* */
                @Override
                public Map getHeaders() throws AuthFailureError {
                    HashMap headers = new HashMap();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "basic bearer token");
                    return headers;
                }
            };
            BarcodeCaptureActivity.getInstance().addToRequestQueue(postNewStock, "postRequestStock");

        }catch (Exception exc){
            exc.printStackTrace();
        }
    }

    public void showDataToUser(final JSONObject designpart){
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Data: ");
        String message;
        message = "";
        try {
            message = "partName: " + designpart.get("partName")+" \n";
            message += "partId: "+designpart.get("partId");
        }catch (Exception exc){
            exc.printStackTrace();
        }
        builder.setMessage(message);
        builder.setNegativeButton("cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                Toast.makeText(BarcodeCaptureActivity.this, "canceling last part!", Toast.LENGTH_SHORT).show();
                //if something goes wrong what else do u do ?
                //wait 3 seconds and re enable the camera
                //cancel the last task and stock
                try{
                    System.out.println("i come here !");
                    //updateFailedTask(designpart.get("_id").toString());
                    //updateFailedStock(designpart);
                    cancelAllRequests("putRequestTask");

                    System.out.println("This is the designpart: "+designpart.toString());
                    System.out.println("This is the designPart Id: "+designpart.get("id"));
                    updateFailedTask(designpart.get("id").toString());
                    updateFailedStock(designpart);
                }catch (Exception exc){
                    exc.printStackTrace();
                }
            }
        });

        final AlertDialog dialog = builder.create();
        dialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface arg0) {
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setBackgroundColor(Color.parseColor("#DB2424"));
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(Color.parseColor("#FFFFFF"));
            }
        });
        dialog.show();
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        //Do something after 3 second

                        dialog.dismiss();
                        barcodeCapture.setEnabled(true);
                    }
                }, 3000);
            }
        });
        //wait 3 seconds and dismiss the dialog, also re enable the camera
        //dialog.dismiss();
    }

    public void getDesignPartById(final String designPartId){
        if (designPartId == null) {
            throw new NullPointerException("designpartId is null");
        }
        String getUrl = "https://develop.enforge.io/api/saleItems/designPart/" + designPartId;
        //method,url, jsonRequest, responseListener, errorListener
        JsonObjectRequest jsonObjectGetRequest = new JsonObjectRequest(Request.Method.GET,
                getUrl,
                null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(final JSONObject response) {
                System.out.println("this is the response: "+response.toString());
                //show dialog from here?
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        showDataToUser(response);
                    }
                });

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        new Handler().postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                //showDataToUser(response);
                                //make stock request
                                updateStock(response);
                                //make task request
                                updateTask(designPartId);
                            }
                        }, 5000);
                    }
                });
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("is there any errors?");
                System.out.println("is there any errors? " + error);
                //Failure Callback
                //wait 3 seconds and enable the camera again
                Toast.makeText(BarcodeCaptureActivity.this, "Cant get Design item", Toast.LENGTH_SHORT).show();
            }
        }) {
            /** Passing some request headers* */
            @Override
            public Map getHeaders() throws AuthFailureError {
                HashMap headers = new HashMap();
                headers.put("Authorization", "basic bearer token");
                return headers;
            }
        };
        BarcodeCaptureActivity.getInstance().addToRequestQueue(jsonObjectGetRequest, "getDesignpart");
    }

    @Override
    public void onObservationStarted(@NotNull BarcodeCapture barcodeCapture) {

    }

    @Override
    public void onObservationStopped(@NotNull BarcodeCapture barcodeCapture) {

    }

    @Override
    public void onSessionUpdated(@NotNull BarcodeCapture barcodeCapture, @NotNull BarcodeCaptureSession barcodeCaptureSession, @NotNull FrameData frameData) {

    }
}
