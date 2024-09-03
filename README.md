## سیستم مدیریت محتوا 
این پروژه یک سیستم مدیریت محتوا (CMS) مشابه WordPress است که با استفاده از Node.js و MongoDB توسعه داده شده است. این سیستم به کاربران امکان می‌دهد که محتوا را به صورت داینامیک مدیریت کنند و قالب‌های مختلفی برای سایت خود ایجاد و استفاده کنند. همچنین دارای امکاناتی مانند سیستم رتبه‌بندی، تغییر زبان، ارسال و مدیریت پست‌ها و نظرات، و پنل مدیریت قدرتمند می‌باشد.

# تصاویر
![01](https://github.com/zenyos/CMS/blob/main/screenshots/1.jpg)


![02](https://github.com/zenyos/CMS/blob/main/screenshots/2.jpg)


![03](https://github.com/zenyos/CMS/blob/main/screenshots/3.jpg)


![04](https://github.com/zenyos/CMS/blob/main/screenshots/4.jpg)


![05](https://github.com/zenyos/CMS/blob/main/screenshots/5.jpg)


![06](https://github.com/zenyos/CMS/blob/main/screenshots/6.jpg)


![07](https://github.com/zenyos/CMS/blob/main/screenshots/7.jpg)


![08](https://github.com/zenyos/CMS/blob/main/screenshots/8.jpg)


![09](https://github.com/zenyos/CMS/blob/main/screenshots/9.jpg)


![10](https://github.com/zenyos/CMS/blob/main/screenshots/10.jpg)


![11](https://github.com/zenyos/CMS/blob/main/screenshots/11.jpg)


![12](https://github.com/zenyos/CMS/blob/main/screenshots/12.jpg)


![13](https://github.com/zenyos/CMS/blob/main/screenshots/13.jpg)


![14](https://github.com/zenyos/CMS/blob/main/screenshots/14.jpg)


![15](https://github.com/zenyos/CMS/blob/main/screenshots/15.jpg)


# ویژگی‌ها
پنل مدیریت کاربرپسند: امکان مدیریت تمامی بخش‌های سایت از طریق پنل مدیریت.
قالب‌های داینامیک: کاربران می‌توانند قالب‌های سایت را ایجاد، ویرایش و استفاده کنند.
ارسال و مدیریت پست‌ها: امکان ارسال و مدیریت پست‌ها به همراه پشتیبانی از دسته‌بندی‌ها و برچسب‌ها.
سیستم نظرات: کاربران می‌توانند نظرات خود را ثبت کنند و مدیران می‌توانند این نظرات را مدیریت کنند.
سیستم رتبه‌بندی: امکان رتبه‌بندی پست‌ها و محتوا توسط کاربران.
چند زبانه: پشتیبانی از چندین زبان برای کاربران مختلف.
مدیریت کاربران: امکان مدیریت کاربران و نقش‌های آنها.
پیش‌نیازها
قبل از نصب و اجرای پروژه، مطمئن شوید که پیش‌نیازهای زیر روی سیستم شما نصب شده‌اند:
```
Node.js
npm یا yarn
MongoDB
```
# نصب و راه‌اندازی
۱. کلون کردن پروژه
ابتدا باید پروژه را کلون کنید:
```
git clone https://github.com/zenyos/CMS.git
cd CMS
```
۱. نصب وابستگی‌ها
برای نصب وابستگی‌های پروژه، دستور زیر را اجرا کنید:

    npm install
  
یا در صورت استفاده از yarn:

    yarn install

۳. تنظیمات محیطی
فایل .env.example را به .env تغییر نام دهید و مقادیر مورد نیاز را در این فایل وارد کنید.



    cp .env.example .env
  
  
در فایل .env باید اطلاعات مربوط به اتصال به دیتابیس MongoDB و سایر تنظیمات مهم را وارد کنید.

۴. اجرای پروژه
برای اجرای پروژه در حالت توسعه، از دستور زیر استفاده کنید:


    npm run dev
  

یا در صورت استفاده از yarn:



    yarn dev
  

سپس می‌توانید به آدرس http://localhost:3000 مراجعه کنید و سایت را مشاهده کنید.

۵. ساخت قالب
برای ایجاد قالب داینامیک، می‌توانید به بخش مدیریت قالب‌ها در پنل ادمین مراجعه

# مشارکت
اگر قصد دارید در توسعه این پروژه مشارکت کنید، می‌توانید یک Pull Request ایجاد کنید یا Issue جدیدی را باز کنید. همچنین برای هرگونه پیشنهاد یا گزارش باگ، از طریق بخش Issues در GitHub با ما در ارتباط باشید.

# نویسندگان
محمد کیانی
