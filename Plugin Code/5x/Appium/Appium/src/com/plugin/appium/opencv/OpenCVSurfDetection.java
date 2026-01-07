package com.plugin.appium.opencv;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import org.opencv.calib3d.Calib3d;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.features2d.DMatch;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FeatureDetector;
import org.opencv.features2d.Features2d;
import org.opencv.features2d.KeyPoint;

public class OpenCVSurfDetection {
	
	private boolean imageMatched;
	private java.awt.Point centerPoint = null;

	public Map<String,String> MatchImage(String templateImagePath, String screenShotImagePath, String outRectangleImageSnapshotPath, String outKeypointImageSnapshotPath) {
		
		Map<String,String> resultOfSearch =  new HashMap<>();
		
		//Format of Images should be in JPG.
		//GRAYSCALE has high performance over normal IMREAD formats.
		System.out.println("Matching Image");
		
		OpenCVUtils.loadLibraries_For_Opencv();

		System.out.println("Feature detection Algo Started....");


		System.out.println("Loading images...");

		/*--------------------------------------------------------------------------------------------------------*/

		Mat templateImageMatrix = org.opencv.highgui.Highgui.imread(templateImagePath, org.opencv.highgui.Highgui.IMREAD_GRAYSCALE);
		Mat screenshotImageMatrix = org.opencv.highgui.Highgui.imread(screenShotImagePath, org.opencv.highgui.Highgui.IMREAD_GRAYSCALE);

		/*--------------------------------------------------------------------------------------------------------*/

		MatOfKeyPoint templateKeyPoints = new MatOfKeyPoint();

		FeatureDetector featureDetector = FeatureDetector.create(FeatureDetector.SURF);

		System.out.println("detecting key points in cropped image...");

		featureDetector.detect(templateImageMatrix, templateKeyPoints); // keypoints of object image is calculated

		org.opencv.features2d.KeyPoint[] keypoints = templateKeyPoints.toArray(); // giving exception

		System.out.println("the keypoints of cropped image are " + " " + keypoints.length);

		MatOfKeyPoint templateDescriptors = new MatOfKeyPoint();

		DescriptorExtractor descriptorExtractor = DescriptorExtractor.create(DescriptorExtractor.SURF);

		System.out.println("Computing descriptors in cropped image....");

		descriptorExtractor.compute(templateImageMatrix, templateKeyPoints, templateDescriptors);

		/*--------------------------------------------------------------------------------------------------------*/
		// Mat matrixKeyPoint_ObjectImage = new Mat(objectImage.rows(),
		// objectImage.cols(), org.opencv.highgui.Highgui.CV_LOAD_IMAGE_COLOR);

		Scalar newKeypointColor = new Scalar(255, 0, 0);

		/*-------------------------------------computing scene keypoints and descriptors-------------------------------------------------------------------*/

		MatOfKeyPoint screenshotKeyPoints = new MatOfKeyPoint();

		MatOfKeyPoint screenshotDescriptors = new MatOfKeyPoint();

		System.out.println("Detecting key points in snapshot image...");

		featureDetector.detect(screenshotImageMatrix, screenshotKeyPoints);

		System.out.println("the keypoints of snapshot image are " + " " + screenshotKeyPoints.toArray().length);

		System.out.println("Computing descriptors in snapshot image...");

		descriptorExtractor.compute(screenshotImageMatrix, screenshotKeyPoints, screenshotDescriptors);

		/*---------------------------------------calculating matches-----------------------------------------------------------------*/

		Mat matrixLinedImage = new Mat(screenshotImageMatrix.rows() * 2, screenshotImageMatrix.cols() * 2,
				org.opencv.highgui.Highgui.IMREAD_GRAYSCALE);

		Scalar matchestColor = new Scalar(0, 255, 0);

		List<MatOfDMatch> matches = new LinkedList<MatOfDMatch>();

		DescriptorMatcher descriptorMatcher = DescriptorMatcher.create(DescriptorMatcher.FLANNBASED); // for matching
		// descriptions

		System.out.println("Matching cropped and snapshot images...");

		System.out.println("template image size : " + templateImageMatrix.cols() + " x " + templateImageMatrix.rows());
		System.out.println("screenshot image size : " + screenshotImageMatrix.cols() + " x " + screenshotImageMatrix.rows());
		if (screenshotDescriptors.type() != CvType.CV_32F) {
			System.out.println("Inside If sceneDescriptors");
			screenshotDescriptors.convertTo(screenshotDescriptors, CvType.CV_32F);
		}

		if (templateDescriptors.type() != CvType.CV_32F) {
			System.out.println("Inside If objectDescriptors");
			templateDescriptors.convertTo(templateDescriptors, CvType.CV_32F);
		}

		descriptorMatcher.knnMatch(templateDescriptors, screenshotDescriptors, matches, 2); // function for matching

		/*----------------------------------calculating good matches----------------------------------------------------------------------*/

		System.out.println("the matches found are " + " " + matches.toArray().length);

		System.out.println("Calculating good match list...");

		List<DMatch> goodMatchesList = new LinkedList<DMatch>();

		float nndrRatio = 0.7f;

		for (int i = 0; i < matches.size(); i++) {
			MatOfDMatch matofDMatch = matches.get(i);
			DMatch[] dmatcharray = matofDMatch.toArray();
			DMatch m1 = dmatcharray[0];
			DMatch m2 = dmatcharray[1];
			if (m1.distance <= m2.distance * nndrRatio) {
				((LinkedList<DMatch>) goodMatchesList).addLast(m1);

			}
		}

		System.out.println("the Good matches found are " + " " + goodMatchesList.size()); // printing size of good
		// matches

		/*--------------------------------------------------------------------------------------------------------*/
		if (goodMatchesList.size() >= 4) {
			System.out.println("More Than Four good matches are found ");
			System.out.println("Object Found With % !!!" + " " + GetPercentage(goodMatchesList, matches));

			List<KeyPoint> objKeypointlist = templateKeyPoints.toList();

			List<KeyPoint> scnKeypointlist = screenshotKeyPoints.toList();

			LinkedList<Point> objectPoints = new LinkedList<Point>();

			LinkedList<Point> scenePoints = new LinkedList<Point>();

			for (int i = 0; i < goodMatchesList.size(); i++) {
				objectPoints.addLast(objKeypointlist.get(goodMatchesList.get(i).queryIdx).pt);
				scenePoints.addLast(scnKeypointlist.get(goodMatchesList.get(i).trainIdx).pt);
			}
			/*--------------------------------------------------------------------------------------------------------*/
			MatOfPoint2f objMatOfPoint2f = new MatOfPoint2f();

			objMatOfPoint2f.fromList(objectPoints);

			MatOfPoint2f scnMatOfPoint2f = new MatOfPoint2f();

			scnMatOfPoint2f.fromList(scenePoints);
			/*---------------------------------------drawing retangle over scene on matched portion using lines -----------------------------------------------------------------*/
			Mat homography = Calib3d.findHomography(objMatOfPoint2f, scnMatOfPoint2f, Calib3d.RANSAC, 3);

			Mat template_corners = new Mat(4, 1, CvType.CV_32FC2);

			Mat screenshot_corners = new Mat(4, 1, CvType.CV_32FC2);

			template_corners.put(0, 0, new double[] { 0, 0 });
			template_corners.put(1, 0, new double[] { templateImageMatrix.cols(), 0 });
			template_corners.put(2, 0, new double[] { templateImageMatrix.cols(), templateImageMatrix.rows() });
			template_corners.put(3, 0, new double[] { 0, templateImageMatrix.rows() });

			System.out.println("Transforming object corners to scene corners...");

			Core.perspectiveTransform(template_corners, screenshot_corners, homography);

			Mat img = org.opencv.highgui.Highgui.imread(screenShotImagePath, org.opencv.highgui.Highgui.IMREAD_GRAYSCALE);

			Core.line(img, new Point(screenshot_corners.get(0, 0)), new Point(screenshot_corners.get(1, 0)),new Scalar(0, 255, 0), 4);

			Core.line(img, new Point(screenshot_corners.get(1, 0)), new Point(screenshot_corners.get(2, 0)),new Scalar(0, 255, 0), 4);

			Core.line(img, new Point(screenshot_corners.get(2, 0)), new Point(screenshot_corners.get(3, 0)),new Scalar(0, 255, 0), 4);

			Core.line(img, new Point(screenshot_corners.get(3, 0)), new Point(screenshot_corners.get(0, 0)),new Scalar(0, 255, 0), 4);
			/*
			 * --------------------------------------------calculating center x and center
			 * y--------------------------------------------------------------
			 */

			// Point p0 = new Point(scene_corners.get(0, 0));  //Top Right point
			Point p1 = new Point(screenshot_corners.get(1, 0)); // (x1, y1)  //Top left point
			// Point p2 = new Point(scene_corners.get(2, 0));  //Bottom left point
			Point p3 = new Point(screenshot_corners.get(3, 0)); // (x2, y2) //Bottom right point

			// @formatter:off
			//
			// P0 ----------------------------------------- P1
			// | |
			// | |
			// | x |
			// | |
			// | |
			// P3 ----------------------------------------- P2
			//
			// @formatter:on

			java.awt.Point p = new java.awt.Point((int) p3.x, (int) p3.y);
			Dimension d = new Dimension((int) (p1.x - p3.x), (int) (p1.y - p3.y));

			Rectangle matchedPortion = new Rectangle(p, d);

			System.out.println("### Matched Portion:" + matchedPortion.x + "," + matchedPortion.y + ","+ matchedPortion.width + "," + matchedPortion.height);
			
			centerPoint = new java.awt.Point((int) matchedPortion.getCenterX(), (int) matchedPortion.getCenterY());

			/*--------------------------------------------------------------------------------------------------------------------------------------------*/
			System.out.println("Drawing matches image...");

			MatOfDMatch goodMatches = new MatOfDMatch();

			goodMatches.fromList(goodMatchesList);

			Features2d.drawMatches(templateImageMatrix, templateKeyPoints, screenshotImageMatrix, screenshotKeyPoints, goodMatches,matrixLinedImage, matchestColor, newKeypointColor, new MatOfByte(), 2);

			org.opencv.highgui.Highgui.imwrite(outKeypointImageSnapshotPath, matrixLinedImage); // drawing matched line
			org.opencv.highgui.Highgui.imwrite(outRectangleImageSnapshotPath, img);

			imageMatched = true;

		}

		else {
			System.out.println("Object Not Found using Surf_Detection Due to bad resolution");
			imageMatched = false;
		}
		
		if(imageMatched) {
			int x = centerPoint.x;
			int y = centerPoint.y;
			resultOfSearch.put("status", "true");
			resultOfSearch.put("x", String.valueOf(x));
			resultOfSearch.put("y", String.valueOf(y));
		}else {
			resultOfSearch.put("status", "false");
		}
		
		System.out.println("Feature detection Ended....");
		
		return resultOfSearch;
	}


	public double GetPercentage(List<DMatch> goodMatchesList, List<MatOfDMatch> matches) {
		double probality = (Double.valueOf(goodMatchesList.size() / Double.valueOf(matches.size()))) * Double.valueOf(100);
		return probality;
	}

}
