package com.plugin.appium.util;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class ImageUtils {
	public File reSize(String inputImagePath, String outputImagePath, int scaledWidth, int scaledHeight)
			throws IOException {
		
		File inputFile = new File(inputImagePath);
		File outputFile = new File(outputImagePath);
		return this.reSize(inputFile, outputFile, scaledWidth, scaledHeight);

	}

	public File reSize(File inputFile, File outputFile, int scaledWidth, int scaledHeight) throws IOException {

		// read input image
		BufferedImage inputImage = ImageIO.read(inputFile);
		return reSize(inputImage, outputFile, scaledWidth, scaledHeight);
	}
	
	public File reSize(BufferedImage inputImage, File outputFile, int scaledWidth, int scaledHeight) throws IOException {

		// create output image
		BufferedImage outputImage = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);

		// scale the input image to output image
		Graphics2D g2d = outputImage.createGraphics();
		g2d.drawImage(inputImage, 0, 0, scaledWidth, scaledHeight, null);
		g2d.dispose();

		// extract extensions of output file
		String formatName = outputFile.getPath().substring(outputFile.getPath().lastIndexOf(".") + 1);

		// Create OutputFile
		ImageIO.write(outputImage, formatName, outputFile);

		return outputFile;
	}
	
	public static void main(String[] args) throws IOException {
		
		
		String inputImage = "C:\\Users\\Lenovo\\Desktop\\Design Solution.png";
		
		BufferedImage bimg = ImageIO.read(new File(inputImage));
		ImageUtils imageUtils = new ImageUtils();
		File file = imageUtils.reSize(bimg, new File("Ouput.jpg"), 250, 250);
		System.out.println(file.getPath());
	}
}
