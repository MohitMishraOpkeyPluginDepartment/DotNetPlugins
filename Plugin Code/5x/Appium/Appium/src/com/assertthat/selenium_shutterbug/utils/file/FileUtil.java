/*
 *  Copyright (c) 2016, Glib Briia  <a href="mailto:glib.briia@assertthat.com">Glib Briia</a>
 *  Distributed under the terms of the MIT License
 */

package com.assertthat.selenium_shutterbug.utils.file;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

/**
 * Created by Glib_Briia on 17/06/2016.
 */
public class FileUtil {

	public static String getJsScript(String fileName) {
		try {
			InputStream is = FileUtil.class.getResourceAsStream(fileName);
			byte[] bytes = new byte[is.available()];
			is.read(bytes);
			String result = new String(bytes, "UTF-8");
			return result;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static void writeImage(BufferedImage imageFile, String extension, File fileToWriteTo) {
		try {
			ImageIO.write(imageFile, extension, fileToWriteTo);
		} catch (IOException e) {
			throw new UnableSaveSnapshotException(e);
		}
	}
}
